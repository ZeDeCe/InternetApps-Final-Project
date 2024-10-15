const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    username: {
        type: String,
        required: true
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
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ItemSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
        set: function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    picture: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10000;
            },
            message: 'Price must be between 1 and 10,000'
        }
    },
    pieces: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10000;
            },
            message: 'Pieces number must be between 1 and 10,000'
        }
    },
    theme: {
        type: String,
        required: true,
        set: function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    },
    description: String,
    ratings: [RatingSchema],
    comments: [CommentSchema]
});

module.exports = mongoose.model("Item", ItemSchema);