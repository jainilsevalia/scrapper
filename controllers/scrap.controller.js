const puppeteer = require('puppeteer');
const Post = require('../models/scrap.model');

async function scrapeAndSavePosts() {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://forums.redflagdeals.com/hot-deals-f9/');
    await page.waitForSelector('.topic_title_link:last-of-type');
    await page.screenshot({path: 'target_blog_page.png', fullPage: true})
    
    const posts = [];

    const postDetails = await page.evaluate(() => {
        const postElements = document.querySelectorAll('.topic_title_link');
        const posts = [];
        postElements.forEach(postElement => {
            const title = postElement.textContent.trim();
            console.log("title:",title);
            const url = postElement.getAttribute('href');
            console.log("url:",url);
            if(url){
                posts.push({ title, url });
            }
        });
        return posts;
    });

    for (const post of postDetails) {

        if (posts.some(existingPost => existingPost.title === post.title)) {
            console.log('Duplicate post found, skipping:', post.title);
            continue;
        }

        await page.goto('https://forums.redflagdeals.com' + post.url); 
        
        try {
            const postData = await page.evaluate((post) => {
                const threadElement = document.querySelector('#thread');
                const postContentElement = threadElement.querySelector('.post_content');
                
                const titleElement = postContentElement.querySelector('.post_title');
                const title = titleElement ? titleElement.textContent.trim() : null; 
                
                const dealLinkElement = postContentElement.querySelector('.deal_link a');
                const dealLink = dealLinkElement ? dealLinkElement.getAttribute('href') : null;
                
                const retailerElement = postContentElement.querySelector('.post_offer dd');
                const retailer = retailerElement ? retailerElement.textContent.trim() : null; 
        
                const contentElement = postContentElement.querySelector('.content');
                const content = contentElement ? contentElement.textContent.trim() : null;
        
                const forumLink = 'https://forums.redflagdeals.com' + post.url;
                
                return { title, forumLink, dealLink, retailer, content };
            }, post);
        
            console.log(postData);
        
            try {
                const post = new Post(postData);
                await post.save();
                console.log('Post saved to database:', postData.title);
            } catch (err) {
                console.error('Failed to save post to database:', err);
            }
        } catch (error) {
            console.error('Error occurred while scraping post data:', error);
        }
    }

    await browser.close();

    console.log("\n \nScraping Completed Successfully for targeted website!! :)");
}

module.exports = { scrapeAndSavePosts };