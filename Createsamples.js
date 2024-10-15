const mongoose = require('mongoose');
require("custom-env").env(process.env.NODE_ENV, "./config")
const Item = require('./models/Item'); // Adjust the path as necessary

// Sample items
const sampleItems = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Millennium Falcon",
        picture: "https://via.placeholder.com/300x200?text=Millennium+Falcon",
        price: 799.99,
        pieces: 7541,
        theme: "Star Wars",
        description: "Build the ultimate Star Wars collectible - the Millennium Falcon!",
        ratings: [],
        comments: []
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Hogwarts Castle",
        picture: "https://via.placeholder.com/300x200?text=Hogwarts+Castle",
        price: 399.99,
        pieces: 6020,
        theme: "Harry Potter",
        description: "Bring the magic of Hogwarts to your home with this detailed castle model.",
        ratings: [],
        comments: []
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Eiffel Tower",
        picture: "https://via.placeholder.com/300x200?text=Eiffel+Tower",
        price: 629.99,
        pieces: 1023,
        theme: "Architecture",
        description: "Recreate the iconic Parisian landmark with this challenging build.",
        ratings: [],
        comments: []
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "NASA Apollo Saturn V",
        picture: "https://via.placeholder.com/300x200?text=NASA+Apollo+Saturn+V",
        price: 119.99,
        pieces: 1969,
        theme: "Space",
        description: "Celebrate space exploration with this meter-high LEGO rocket.",
        ratings: [],
        comments: []
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Ghostbusters ECTO-1",
        picture: "https://via.placeholder.com/300x200?text=Ghostbusters+ECTO-1",
        price: 199.99,
        pieces: 2352,
        theme: "Movies",
        description: "Who you gonna call? Build the iconic Ghostbusters' car!",
        ratings: [],
        comments: []
    }
];

// Function to delete all existing items
async function deleteAllItems() {
    try {
        const result = await Item.deleteMany({});
        console.log(`${result.deletedCount} items deleted`);
    } catch (error) {
        console.error('Error deleting items:', error);
        throw error;
    }
}

// Function to insert sample items
async function insertSampleItems() {
    try {
        const result = await Item.insertMany(sampleItems);
        console.log(`${result.length} items inserted`);
        return result;
    } catch (error) {
        console.error('Error inserting items:', error);
        throw error;
    }
}

// Function to verify inserted items
async function verifyInsertedItems() {
    try {
        const items = await Item.find({});
        console.log(`Found ${items.length} items in the database:`);
        items.forEach(item => {
            console.log(`- ${item.name} (ID: ${item._id})`);
        });
    } catch (error) {
        console.error('Error verifying items:', error);
        throw error;
    }
}

// Main function to run the script
async function createSamples() {
    let client;
    try {
        client = await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');
        
        await deleteAllItems();
        const insertedItems = await insertSampleItems();
        console.log('Sample creation completed successfully');
        
        await verifyInsertedItems();
    } catch (error) {
        console.error('Error in createSamples:', error);
    } finally {
        if (client) {
            await client.disconnect();
            console.log('Disconnected from MongoDB');
        }
    }
}

// Run the script
createSamples();