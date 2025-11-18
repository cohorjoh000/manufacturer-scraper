export default async function handler(req, res) {
  try {
    // Support both GET ?url=... and POST { "url": "..." }
    const method = req.method || "GET";
    let targetUrl = null;

    if (method === "GET") {
      targetUrl = req.query.url;
    } else if (method === "POST") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }
      try {
        const json = JSON.parse(body || "{}");
        targetUrl = json.url;
      } catch (e) {
        // ignore, will fail below if no url
      }
    }

    if (!targetUrl) {
      return res.status(400).json({ error: "Missing 'url' parameter." });
    }

    // Basic HTML fetch with a realistic User-Agent
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream HTTP error ${response.status} when fetching ${targetUrl}`
      });
    }

    const html = await response.text();

    return res.status(200).json({ html });

  } catch (err) {
    console.error("Scrape error:", err);
    return res.status(500).json({ error: err.message });
  }
}
