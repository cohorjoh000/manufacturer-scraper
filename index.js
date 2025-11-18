export default function handler(req, res) {
  res.status(200).json({
    message: "Manufacturer Scraper API is live.",
    endpoints: ["/api/scrape"]
  });
}
