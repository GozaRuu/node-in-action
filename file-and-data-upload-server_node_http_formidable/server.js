const http = require('http');
const displayForm = require('./displayForm');
const readFormData = require('./readFormData').readFormData;

let count = 1;

const handleRequest = (req, res) => {
  if (req.url =='/') {
    switch (req.method) {
      case 'GET':
        displayForm.display(res, count);
        break;
      case 'POST':
        count++; //new contestant
        readFormData(req, res);
        break;
      default:
        res.setStatus = 400;
        res.end(`<h1>ERROR 400: Method not supported</h1>`);
    }
  } else {
    res.setStatus = 404;
    res.end(`<h1>ERROR 404: File Not Found<?h1>`);
  }
};

const server = http.createServer(handleRequest);
exports.server = server;
