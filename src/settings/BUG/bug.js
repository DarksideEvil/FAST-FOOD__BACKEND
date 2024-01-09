module.exports = (err) => {
    // Optionally, log the error to a file
    const fs = require('fs');
    fs.appendFileSync('error.log', `date: ${new Date().toISOString()} err: ${err}\n`);
}