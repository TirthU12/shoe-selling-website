const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true,
        unique: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            size: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            orderDate: {
                type: Date,
                default: Date.now()
            },
            orderStatus: {
                type: String,
                default: "Pending",
                required: true
            },
            paymentMethod: {
                type: String,
                default: "Cash On Delivery",
                required: true
            },
            deliveryDate: {
                type: Date,
                default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            shippingAddress: {
                type: String,
                required: true
            }

        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order