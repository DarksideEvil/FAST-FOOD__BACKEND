const { config } = require('dotenv');
config();
const DB = require('./settings/DB/db');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const allRoutes = require('./mainRouter');
const writeError = require('./settings/BUG/bug');

// connecting database
DB();
// parsing incoming data
app.use(express.json());
// all routes coming here
app.use('/api', allRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    writeError(err);
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// connecting port
app.listen(PORT, () => console.log(`${PORT} port's living...`));