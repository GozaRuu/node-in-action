const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/jsjoe';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('connected correctly to mongodb through mongoose');
});
