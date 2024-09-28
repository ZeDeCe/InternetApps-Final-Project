const mongoose = require('mongoose');
const Item = require('./models/Item');

mongoose.connect(process.env.DB_URL);

const items = [
    {
        name: "2x4 Red Brick",
        slug: "2x4-red-brick",
        picture: "/images/2x4-red-brick.jpg",
        price: 0.20,
        description: "Classic 2x4 red Lego brick"
    },
    {
        name: "2x2 Blue Plate",
        slug: "2x2-blue-plate",
        picture: "/images/2x2-blue-plate.jpg",
        price: 0.15,
        description: "Versatile 2x2 blue Lego plate"
    },
    {
        name: "1x6 Yellow Tile",
        slug: "1x6-yellow-tile",
        picture: "/images/1x6-yellow-tile.jpg",
        price: 0.10,
        description: "Smooth 1x6 yellow Lego tile"
    }
];

async function seedItems() {
    try {
        for (let item of items) {
            await Item.create(item);
        }
        console.log('Items seeded successfully');
    } catch (error) {
        console.error('Error seeding items:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedItems();