//file is for seeding the data

const mongoose = require('mongoose');
const Scene = require('../models/scene');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/rap-scene');
 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)]
//basically to get a random element from the array

const seedDB = async() => {
    await Scene.deleteMany({});
    for(let i =0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        // console.log(data);
        const Camp = new Scene({
            author: '66c03b7a7a3337c9f7189463',
            Location: `${cities[random1000].city}, ${cities[random1000].state}`,
            Title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            desctiption: 'Lorem aodfjdofhosdhjfg',
            price : price
        })
        await Camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});


