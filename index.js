const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Node.js Calculator API is running....!");
});

app.get("/add", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  res.json({ operation: "add", result: a + b });
});

app.get("/subtract", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  res.json({ operation: "subtract", result: a - b });
});

app.get("/multiply", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  res.json({ operation: "multiply", result: a * b });
});

app.get("/divide", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (b === 0) {
    return res.status(400).json({ error: "Cannot divide by zero" });
  }

  res.json({ operation: "divide", result: a / b });
});

app.listen(PORT, () => {
  console.log(`Calculator app running on port ${PORT}`);
});
