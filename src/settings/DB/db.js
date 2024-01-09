const mongoose = require('mongoose'),
writeError = require('../BUG/bug');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log('DB living...');
    }
    catch (bug) {
        writeError(bug);
        console.error(bug);
    }
}