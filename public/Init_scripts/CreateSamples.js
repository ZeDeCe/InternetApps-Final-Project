require("custom-env").env(process.env.NODE_ENV, "./config");
const mongoose = require('mongoose');
const Item = require('./models/Item');

mongoose.connect(process.env.DB_URL);

const sampleItems = [
    {
        name: 'Yellow Tile',
        slug: 'yellow-tile',
        picture: '1x6-yellow-tile.jpg',
        price: 1.99,
        description: 'A 1x6 yellow LEGO tile.',
        ratings: []
    },
    {
        name: 'Blue Plate',
        slug: 'blue-plate',
        picture: '2x2-blue-plate.jpg',
        price: 0.99,
        description: 'A 2x2 blue LEGO plate.',
        ratings: []
    },
    {
        name: 'Red Brick',
        slug: 'red-brick',
        picture: '2x4-red-brick.jpg',
        price: 1.49,
        description: 'A 2x4 red LEGO brick.',
        ratings: []
    }
];

async function createSampleItems() {
    try {
        await Item.deleteMany({}); // Clear existing items
        await Item.insertMany(sampleItems);
        console.log('Sample items created successfully');
    } catch (error) {
        console.error('Error creating sample items:', error);
    } finally {
        mongoose.disconnect();
    }
}

createSampleItems();