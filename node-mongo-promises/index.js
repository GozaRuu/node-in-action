const MongoClient = require('mongodb').MongoClient;
const dbOps = require('./operations');

const url = 'mongodb://localhost:27017';
const dbname = 'expmon';

MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
    console.log('connected correctly to server');
    const db = client.db(dbname);

    dbOps.insertDocument(db, {name: 'pizza poem', description: 'pizzzzza me amore'}, 'poems')
    .then((result) => {
        console.log(`Inserted Documents:\n`, result.ops);
        return dbOps.findDocuments(db, 'poems');
    })
    .then((docs) => {
        console.log('Found Document:\n', docs);
        return dbOps.updateDocument(db, {name: 'pizza poem'}, {description: 'Love is Pizza'}, 'poems');
    })
    .then((result) => {
        console.log(`Updated Document:`, result.result);

        return dbOps.findDocuments(db, 'poems');
    })
    .then((docs) => {
        console.log('Found Document:\n', docs);
        return db.dropCollection('poems')
    })
    .then((result) => {
        if(result) console.log(`Dropped Collection ${result}`);
        client.close();
    })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));
