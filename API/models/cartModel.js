const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: {
                type: Number,
            },
            _id: false,
        },
    ],
})

exports.Cart = mongoose.model('cart', cartSchema)