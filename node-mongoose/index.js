const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/jsjoe';
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log('connected correctly to mongodb through mongoose');

    Dishes.create({
        name: 'pizza',
        description: 'pizza is awesome'
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.findByIdAndUpdate(dish._id, {$set: {description: 'Updated'}}, {new: true} ).exec();
    })
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
            rating:5,
            comment: 'Dope!',
            author: 'K.Dot'
        });
        return dish.save();
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.deleteMany({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});
