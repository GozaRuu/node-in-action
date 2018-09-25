const http = require('http');

const HOST = 'localhost';
const PORT = '3000';

//this server will receive TODOs and save them in an array and perfrom CRUD operaton on them
const TODOS = []; //js array to hold the data no persistance required in this project

const serveQuery = (req, res) => {
  switch (req.method) {
    case 'POST':
      let todo = '';
      req.on('data', (chunk) => {
        todo += chunk; //build the todo through listening to data chunks
      });
      req.on('end', (lastChunk) => {
        if(lastChunk) todo += lastChunk; //add last chunk and save the data
        TODOS.push(todo);
        console.log(`Received Todo: ${todo}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end();
      });
      break;

    case 'GET':
      //build the body before sening the headers to know the Content-Length header
      let body = '<h1>No Todos today !! Nice.</h1>';
      if (TODOS.length != 0) {
        body = '<h1>This is your todo-list for today</h1>';
        body += '<ul>';
        TODOS.forEach((todo, i) => {
          body+= `<li><h1>${i}) ${todo}</h1></li>`;
          console.log(`${i}) ${todo}`);
        });
        body += '</ul>';
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.end(body);
      break;

    default:
      res.statusCode = 404;
      res.end('<h1>ERROR 404: UNSUPPORTED OR WRONG METHOD</h1>');
  }
};

const server = http.createServer(serveQuery);
server.listen(PORT, HOST, () => console.log(`app is now listening on port ${PORT}...`));

exports.server = server;
