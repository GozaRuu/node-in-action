const server = require('./server').server;

const HOST = 'localhost';
const PORT = '3000';


server.listen(PORT, HOST, () => console.log(`app is now listening on port ${PORT}...`));
