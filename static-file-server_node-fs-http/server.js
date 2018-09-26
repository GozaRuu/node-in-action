const http = require('http');
const fs = require('fs');
const urlParse = require('url').parse;
const pathResolve = require('path').resolve;


const handleRequest = (req, res) => {
  const filepath = pathResolve('./public' + urlParse(req.url).pathname);
  console.log(`Request for file ${urlParse(req.url).pathname}`);
  fs.createReadStream(filepath).pipe(res);
};

const server = http.createServer(handleRequest);
exports.server = server;
