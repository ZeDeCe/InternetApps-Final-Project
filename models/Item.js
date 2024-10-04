const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    ratings: [RatingSchema],
    comments: [CommentSchema]
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;