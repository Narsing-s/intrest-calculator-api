const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

// serve frontend
app.use(express.static("public"));

// root route
app.get("/", (req, res) => {
  res.send("Interest Calculator API Running 🚀");
});

const SIMPLE_API =
  "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/simple-interest";

const COMPOUND_API =
  "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/compound-interest";

app.post("/simple-interest", async (req, res) => {
  const response = await fetch(SIMPLE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
});

app.post("/compound-interest", async (req, res) => {
  const response = await fetch(COMPOUND_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
