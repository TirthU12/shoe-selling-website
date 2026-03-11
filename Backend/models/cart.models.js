const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true,
        unique: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                default: 1,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        }

    ],
    totalPrice: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart