// server.js
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Mule API endpoints (override via env if needed)
const SIMPLE_API =
  process.env.SIMPLE_API ||
  "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/simple-interest";

const COMPOUND_API =
  process.env.COMPOUND_API ||
  "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/compound-interest";

// Diagnostics
app.use((req, res, next) => {
  res.setHeader("X-App", "Interest-Calculator-UI");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static UI from /public
app.use(express.static(path.join(__dirname, "public")));

// Health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    node: process.version,
    simpleApi: SIMPLE_API,
    compoundApi: COMPOUND_API,
  });
});

// Proxy to Mule (avoid CORS in browser)
app.post("/api/simple-interest", async (req, res) => {
  try {
    const upstream = await fetch(SIMPLE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", details: e.message });
  }
});

app.post("/api/compound-interest", async (req, res) => {
  try {
    const upstream = await fetch(COMPOUND_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", details: e.message });
  }
});

// Root serves the UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

app.listen(PORT, () => {
  console.log(`Interest Calculator running on port ${PORT}`);
});
