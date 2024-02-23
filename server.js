const express = require('express');
const connectDB = require('./config/db.instance');
const scraperRoutes = require('./routes/scrap.route');

const app = express();

connectDB();

app.use('/', scraperRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));