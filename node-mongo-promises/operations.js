exports.insertDocument = (db, document, collection, callback) => {
    db.collection(collection).insertOne(document, (err, result) => {
        if(err) {
            callback(err);
            return;
        }
        console.log(`inserted ${result.result.n} documents into the collection ${collection}`);
        callback(null, result);
    });
};

exports.findDocuments = (db, collection, callback) => {
    db.collection(collection).find({}).toArray((err,docs) => {
        if(err) {
            callback(err);
            return;
        }
        console.log(`Found Document\n`, docs);
        callback(null, docs);
    });
};

exports.removeDocument = (db, document, collection, callback) => {
    db.collection(collection).deleteOne(document, (err, result) => {
        if(err) {
            callback(err);
            return;
        }
        console.log(`Removed the document`, document);
        callback(null, result);
    });
};

exports.updateDocument = (db, document, update, collection, callback) => {
    db.collection(collection).updateOne(document, {$set: update}, null, (err, result) => {
        if(err) {
            callback(err);
            return;
        }
        console.log(`Updated the document: ${JSON.stringify(document)} with update: ${JSON.stringify(update)}`);
        callback(null, result);
    });
};
