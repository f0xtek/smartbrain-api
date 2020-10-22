const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const dbConfigFile = path.join(__dirname, `./${env}DBConfig.json`);
exports.parsedConfig = JSON.parse(fs.readFileSync(dbConfigFile, 'UTF-8'));
