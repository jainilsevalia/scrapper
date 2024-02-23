const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    forumLink: String,
    dealLink: String,
    retailer: String,
    content: String 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;