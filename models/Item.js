//@Tomer

const mongoose = require('mongoose')

const Item = new mongoose.Schema ({
    // TODO @TOMER
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String, //Url of item picture
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    description: String,
    // You may add more features if you'd like :)
})

module.exports = mongoose.model("Item", Item)