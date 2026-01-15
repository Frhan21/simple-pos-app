import { db } from "@/server/db";
import type { NextApiHandler } from "next";

type XenditWebhookBody = {
  event: "payment.succeded";
  data: {
    id: string;
    amount: number;
    payment_request_id: string;
    reference_id: string;
    status: "SUCCEEDED" | "FAILED";
  };
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as Partial<XenditWebhookBody> | undefined;
  if (!body?.data?.reference_id || !body?.data?.status) {
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
    return res.status(404).send("order not found!");
  }

  if (body.data.status !== "SUCCEEDED") {
    return res.status(200).json({ ok: true });
  }
  // 2. update order if success
  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      paidAt: new Date(),
      status: "PROCESSING",
    },
  });

  return res.status(200).json({ ok: true });
};

export default handler;
