// Express-based webhook proxy to forward ChatGPT calendar events to Make

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Load Make webhook URL from environment variable
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

if (!MAKE_WEBHOOK_URL) {
  throw new Error("Missing MAKE_WEBHOOK_URL environment variable");
}

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(MAKE_WEBHOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.status(200).json({ status: "Forwarded to Make", makeStatus: response.status });
  } catch (error) {
    console.error("Error forwarding to Make:", error.message);
    res.status(500).json({ error: "Failed to forward to Make" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});

module.exports = app;
