const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOps = require('./operations');

const url = 'mongodb://localhost:27017';
const dbname = 'expmon';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    assert.equal(err, null);
    console.log('connected correctly to server');

    const db = client.db(dbname);
    dbOps.insertDocument(db, {name: 'pizza poem', description: 'pizzzzza me amore'}, 'poems', (err, result) => {
        assert.equal(err, null);
        console.log(`Inserted Documents:\n`, result.ops);

        dbOps.findDocuments(db, 'poems', (err, docs) => {
            assert.equal(err, null);

            dbOps.updateDocument(db, {name: 'pizza poem'}, {description: 'Love is Pizza'}, 'poems', (err, result) => {
                assert.equal(err, null);
                console.log(`Updated Document:`, result.result);

                dbOps.findDocuments(db, 'poems', (err, docs) => {
                    assert.equal(err, null);

                    db.dropCollection('poems', (err) => {
                        if(err) console.log(`Dropped Collection ${err}`);
                        client.close();
                    });
                });
            });
        });
    });
});
