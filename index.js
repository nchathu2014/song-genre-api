const express = require('express');
const app = express();

const health = require('./routes/health');
const genre = require('./routes/genre');

// Inbuilt middleware
app.use(express.json());

//Routes
app.use('/health', health);
app.use('/api/genres', genre);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));


