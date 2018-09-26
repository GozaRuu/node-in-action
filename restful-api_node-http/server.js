const http = require('http');
const url = require('url');

//this server will receive TODOs and save them in an array and perfrom CRUD operaton on them
const TODOS = []; //js array to hold the data no persistance required in this project

const handleRequest = (req, res) => {
  switch (req.method) {
    case 'POST':
      let todo = '';
      req.on('data', (chunk) => {
        todo += chunk; //build the todo through listening to data chunks
      });
      req.on('end', (lastChunk) => {
        if(lastChunk) todo += lastChunk; //add last chunk and save the data
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        if(todo == '') {
          res.statusCode = 500;
          res.end('ERROR 500: NO EMPTY TODOS ALLOWED');
          return;
        }
        TODOS.push(todo);
        console.log(`Received Todo: ${todo}`);
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

    case 'DELETE':
      //get id of element to delete from the url
      const pathname = url.parse(req.url).pathname; //parse url with the url module
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      //handle wrong requests
      if(pathname == '') {
        res.end('ERROR 404: WRONG DELETE REQUEST');
        return;
      }

      const todoID = parseInt(pathname.slice(1));
      if(isNaN(todoID)) res.end('ERROR 404: THE ID PROVIDED IS NOT A NUMBER');
      else if(todoID < 0 || todoID >= TODOS.length) res.end('ERROR 404: THE ID PROVIDED IS NON EXISTANT');
      else {
        //OK
        res.statusCode = 200;
        const deletedTodo = TODOS.splice(todoID,1);
        console.log(`deleted todo ${todoID}: ${deletedTodo}`);
        res.end('OK');
      }
      break;

    case 'PUT':
      let newTodo = '';
      req.on('data', (chunk) => {
        newTodo += chunk; //build the newTodo through listening to data chunks
      });
      req.on('end', (lastChunk) => {
        if(lastChunk) newTodo += lastChunk; //add last chunk and save the data

        //send the response now that we have all the data
        const pathname = url.parse(req.url).pathname; //parse url with the url module
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        //handle wrong requests
        if(pathname == '') {
          res.end('ERROR 404: WRONG DELETE REQUEST');
          return;
        }
        if(newTodo == '') {
          res.statusCode = 500;
          res.end('ERROR 500: NO EMPTY TODOS ALLOWED');
          return;
        }
        const updateTodoID = parseInt(pathname.slice(1));
        if(isNaN(updateTodoID)) res.end('ERROR 404: THE ID PROVIDED IS NOT A NUMBER');
        else if(updateTodoID < 0 || updateTodoID >= TODOS.length) res.end('ERROR 404: THE ID PROVIDED IS NON EXISTANT');
        res.statusCode = 200;
        TODOS[updateTodoID] = newTodo; //update todo
        console.log(`updated todo ${updateTodoID}: ${TODOS[updateTodoID]}`);
        res.end('OK');
      });
      break;

    default:
      res.statusCode = 404;
      res.end('<h1>ERROR 404: UNSUPPORTED OR WRONG METHOD</h1>');
  }
};

const server = http.createServer(handleRequest);
exports.server = server;
