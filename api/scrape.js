const puppeteer = require("puppeteer-core");

export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    // Load the Vercel-provided Chrome binary
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      headless: "new"
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Scroll to bottom in case it's a long directory
    await autoScroll(page);

    const html = await page.content();
    await browser.close();

    return res.status(200).json({ html });

  } catch (err) {
    console.error("Scraper error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Helper: scroll page to bottom
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
