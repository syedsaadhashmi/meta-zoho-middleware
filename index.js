import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "Decisive@2025";
const ZOHO_FLOW_URL =
  process.env.ZOHO_FLOW_URL ||
  "https://flow.zoho.com/691753397/flow/webhook/incoming?zapikey=1001.66a5acb2e7625d61a4ac4e41adceb1ba.d42cf61e3af5b60e539da52ca8ec400c&isdebug=false";

// Meta verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Messages receive & forward to Zoho Flow (POST)
app.post("/webhook", async (req, res) => {
  try {
    await axios.post(ZOHO_FLOW_URL, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error sending to Zoho Flow:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
