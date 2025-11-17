import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Basic test endpoint
app.get("/", (req, res) => {
  res.send("Scraper server is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
