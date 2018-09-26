const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;

const handleRequest = (req, res) => {
  const filepath = path.resolve(root + '/public' + req.url);
  fs.createReadStream(filepath).pipe(res);
};

const server = http.createServer(handleRequest);
exports.server = server;
