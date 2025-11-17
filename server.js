import express from "express";
import puppeteer from "puppeteer-core";

const app = express();

app.get("/scrape", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      headless: "new"
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const html = await page.content();
    await browser.close();

    res.json({ html: html });
  } catch (error) {
    console.error("Scraper error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Scraper server running on port 3000"));
