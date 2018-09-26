const http = require('http');
const displayForm = require('./displayForm');
const readUserData = require('./readUserData');


const handleRequest = (req, res) => {
  if (req.url =='/') {
    switch (req.method) {
      case 'GET':
        displayForm.display(res);
        break;
      case 'POST':
        displayForm.incrementCount(); //new contestant
        readUserInput(req, res);
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
