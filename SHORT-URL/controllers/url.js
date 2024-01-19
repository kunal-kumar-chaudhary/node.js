// we will pass the length and it'll generate the nanoid of that length
// example: nanoid(5) will generate a string of length 5
const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  // we need to add this inside database so we will import our model here
  const shortID = shortid();
  const body = req.body;
  // first of all we will check for the availability of the url inside the body
  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }
  await URL.create({
    shortId: shortID,
    redirectedURL: req.body.url,
    visitHistory: [],
    createdBy: req.user._id, 
  });
  // we will send the response back to the client
  return res.render("home", { id: shortID});
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
