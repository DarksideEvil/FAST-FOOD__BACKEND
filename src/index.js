const { config } = require('dotenv');
config();
const DB = require('./settings/DB/db'),
express = require('express'),
app = express(),
PORT = process.env.PORT,
allRoutes = require('./mainRouter')

// connecting database
DB();
//
app.use(express.json());
// all routes coming here
app.use('/api', allRoutes);
// connecting port
app.listen(PORT, () => console.log(`${PORT} port's living...`));