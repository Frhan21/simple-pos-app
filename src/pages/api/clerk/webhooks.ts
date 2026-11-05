import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextApiHandler } from "next";
import {
  softDeleteClerkUser,
  syncClerkUser,
} from "@/server/users/sync-clerk-user";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;
  try {
    // verifyWebhook reads CLERK_WEBHOOK_SIGNING_SECRET and verifies Svix headers
    event = await verifyWebhook(req);
  } catch {
    return res.status(400).json({ error: "Webhook verification failed" });
  }

  try {
    // Idempotent: created/updated both upsert, deleted soft-deletes (idempotent too).
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await syncClerkUser({
          id: event.data.id,
          email:
            event.data.email_addresses.find(
              (e) => e.id === event.data.primary_email_address_id,
            )?.email_address ??
            event.data.email_addresses[0]?.email_address ??
            null,
          name:
            [event.data.first_name, event.data.last_name]
              .filter(Boolean)
              .join(" ") || null,
          imageUrl: event.data.image_url || null,
        });
        break;
      case "user.deleted":
        if (event.data.id) {
          await softDeleteClerkUser(event.data.id);
        }
        break;
      default:
        // Ignore other event types
        break;
    }
  } catch (err) {
    console.error("Clerk webhook processing failed:", err);
    // 5xx so Clerk retries the delivery
    return res.status(500).json({ error: "Webhook processing failed" });
  }

  return res.status(200).json({ ok: true });
};

export default handler;
