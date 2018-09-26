const http = require('http');
const fs = require('fs');
const urlParse = require('url').parse;
const pathResolve = require('path').resolve;


const handleRequest = (req, res) => {
  const filepath = pathResolve('./public' + urlParse(req.url).pathname);
  console.log(`Request for file ${urlParse(req.url).pathname}`);
  fs.stat(filepath, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.statusCode = 404;
        res.end(`<h1>ERROR 404: File Not Found</h1>`);
      } else {
        res.statusCode = 500;
        res.end(`<h1>ERROR 500: Internal Server Error</h1>`);
      }
    } else {
      const stream = fs.createReadStream(filepath)
      stream.pipe(res);
      stream.on('error', (err) => {
        res.statusCode = 500;
        res.end('<h1>ERROR 500: Internal Server Error</h1>');
      });
    }
  });
};

const server = http.createServer(handleRequest);
exports.server = server;