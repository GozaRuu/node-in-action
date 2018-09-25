const http = require('http');

const HOST = 'localhost';
const PORT = '3000';

const serveQuery = (req, res) => {
  console.log(req.method);
  res.end();
};

const server = http.createServer(serveQuery);
server.listen(PORT, HOST, () => console.log(`app is now listening on port ${PORT}...`));

exports.server = server;
