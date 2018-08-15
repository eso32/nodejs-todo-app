var mongoose = require('mongoose');
var fs = require('fs'),
    configPath = './server/db/config.json';

var { pass, user, host } = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

console.log("Kredki do logowania ", pass, user, host);

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${user}:${pass}@${host}/${user}`);

module.exports = { mongoose };