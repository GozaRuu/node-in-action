const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbname = 'expmon';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    assert.equal(err, null);
    console.log('connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection('poems');

    collection.insertOne({"name": "pizza poem", "description":"pizzzza is amore"}, (err, result) =>{
        assert.equal(err, null);
        console.log('\nAfter Insert:');
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => {
            assert.equal(err, null);
            console.log('\nFound:');
            console.log(docs);

            db.dropCollection('poems', (err, result) => {
                assert.equal(err, null);
                client.close();
            })
        });
    });
});
