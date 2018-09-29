const http = require('http');
const mysql = require('mysql');
const nodeMysql = require('./lib/nodeMysql');

const HOST = 'localhost';
const PORT = '3000';

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'nodemysql',
  password: 'nodemysql',
  database: 'nodemysql'
});

const handleRequest = (req, res) => {
  switch (req.url) {

    case '/':
      switch (req.method) {
        case 'GET':
          nodeMysql.show(res);
          break;
        case 'POST':
          nodeMysql.register(db, req, res);
          break;
        default:
          res.end('<h1>ERROR 400: Unsupported Method</h1>');
      }
      break;

    case '/show':
      switch (req.method) {
        case 'GET':
          nodeMysql.showRegistered(db, req, res);
          break;
        default:
          res.end('<h1>ERROR 400: Unsupported Method</h1>');
      }
      break;

    case '/delete':
      switch (req.method) {
        case 'POST':
          nodeMysql.delete(db, req, res);
          break;
        default:
          res.end('<h1>ERROR 400: Unsupported Method</h1>');
      }

    default:
      res.end('<h1>ERROR 404: File Not Found</h1>');
  }
};

const server = http.createServer(handleRequest);
db.query(`
  CREATE TABLE IF NOT EXISTS poem (
    id INT(10) NOT NULL AUTO_INCREMENT,
    date DATE,
    author VARCHAR(30),
    PRIMARY KEY (id)
  )`, (err) => {
  if (err) throw err;
  server.listen(PORT, HOST, () => console.log(`app is now listening on port ${PORT}...`));
});
