const mongoose = require('mongoose')

const Category = new mongoose.Schema ({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    products: [{
        type: objectId,
        ref: 'Item'
      }],
})

module.exports = mongoose.model("Category", Catagory)