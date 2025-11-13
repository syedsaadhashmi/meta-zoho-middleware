import axios from "axios";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "Decisive@2025";
const ZOHO_FLOW_URL =
  process.env.ZOHO_FLOW_URL ||
  "https://flow.zoho.com/691753397/flow/webhook/incoming?zapikey=1001.66a5acb2e7625d61a4ac4e41adceb1ba.d42cf61e3af5b60e539da52ca8ec400c&isdebug=false";

export default async function handler(req, res) {
  // METHOD check
  const method = req.method;

  if (method === "GET") {
    // Meta verification
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified with Meta");
      return res.status(200).send(challenge);
    }

    console.log("❌ Verification failed: token mismatch");
    return res.sendStatus(403);
  }

  if (method === "POST") {
    try {
      console.log("📩 Incoming from Meta:", JSON.stringify(req.body));

      await axios.post(ZOHO_FLOW_URL, req.body);

      console.log("➡️ Forwarded to Zoho Flow");
      return res.sendStatus(200);
    } catch (err) {
      console.error("⚠️ Error sending to Zoho Flow:", err.message);
      return res.sendStatus(500);
    }
  }

  // Any other method not allowed
  return res.status(405).send("Method Not Allowed");
}
