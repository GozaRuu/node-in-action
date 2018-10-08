const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/jsjoe';
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log('connected correctly to mongodb through mongoose');
    const newDish = Dishes({
        name: 'pizza',
        description: 'pizza is awesome'
    });

    newDish.save()
    .then((dish) => {
        console.log(dish);
        return Dishes.find({}).exec();
    })
    .then((dishes) => {
        console.log(dishes);
        return Dishes.deleteMany({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});
