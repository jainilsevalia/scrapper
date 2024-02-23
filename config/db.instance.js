const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://jainilsev25:KoiiNetwork@scrappeddatalake.2sxnaz8.mongodb.net/?retryWrites=true&w=majority&appName=ScrappedDataLake', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

module.exports = connectDB;