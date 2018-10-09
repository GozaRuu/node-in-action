const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbname = 'expmon';

MongoClient.connect(url, { useNewUrlParser: true })
.then((client) => {
    console.log('connected correctly to server');
    const db = client.db(dbname);
    const collection = db.collection('poems');

    collection.insertOne({name: 'pizza poem', description: 'pizzzzza me amore'})
    .then((result) => {
        console.log(`Inserted Documents:\n`, result.ops);
        return collection.find({}).toArray();
    })
    .then((docs) => {
        console.log('Found Document:\n', docs);
        return collection.updateOne({name: 'pizza poem'}, {$set: {description: 'Love is Pizza'}}, null);
    })
    .then((result) => {
        console.log(`Updated Document:`, result.result);

        return collection.find({}).toArray();
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
