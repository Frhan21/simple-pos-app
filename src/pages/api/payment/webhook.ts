import { db } from "@/server/db";
import type { NextApiHandler } from "next";

// Events that carry an order reference we act on.
type PaymentSucceededBody = {
  event: "payment.succeeded" | "payment.succeded";
  data: {
    id: string;
    amount: number;
    payment_request_id: string;
    reference_id: string;
    status: "SUCCEEDED" | "FAILED";
  };
};

type PaymentMethodBody = {
  event:
    | "payment_method.expired"
    | "payment_method.activated"
    | "payment_method.pending"
    | "payment_method.succeeded";
  data: {
    id: string;
    status: string;
    reference_id?: string;
  };
};

type XenditWebhookBody = PaymentSucceededBody | PaymentMethodBody;

const isPaymentSucceeded = (
  body: XenditWebhookBody,
): body is PaymentSucceededBody =>
  "event" in body &&
  (body.event === "payment.succeeded" || body.event === "payment.succeded");

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Ambil headers-nya
  const headers = req.headers;
  // Verify webhook from xendit
  const webhookToken = headers["x-callback-token"];

  if (webhookToken !== process.env.XENDIT_WEBHOOK_VERIFICATION) {
    return res.status(401).json({ error: "Invalid callback token" });
  }

  const body = req.body as XenditWebhookBody | undefined;

  if (!body?.event) {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }

  // Acknowledge lifecycle events we don't act on so Xendit stops retrying.
  if (!isPaymentSucceeded(body)) {
    return res.status(200).json({ ok: true, ignored: body.event });
  }

  if (!body.data?.reference_id || !body.data?.status) {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }
  //   process order
  // 1. find order
  const order = await db.order.findUnique({
    where: {
      id: body.data.reference_id,
    },
  });

  if (!order) {
    // Unknown/foreign reference: ack so Xendit stops retrying.
    return res.status(200).json({ ok: true, ignored: "unknown order" });
  }

  if (body.data.status !== "SUCCEEDED") {
    return res.status(200).json({ ok: true });
  }

  // Idempotent: Xendit retries webhooks; don't overwrite an already-paid order.
  if (order.paidAt) {
    return res.status(200).json({ ok: true });
  }
  // 2. update order if success
  await db.order.updateMany({
    where: {
      id: order.id,
      paidAt: null, // guard against retry racing past the check above
    },
    data: {
      paidAt: new Date(),
      status: "PAID",
    },
  });

  return res.status(200).json({ ok: true });
};

export default handler;
