const express = require('express');
const router = express.Router();
const { scrapeAndSavePosts } = require('../controllers/scrap.controller');

router.get('/scrape', async (req, res) => {
    await scrapeAndSavePosts();
    res.send('Scraping completed');
});

module.exports = router;