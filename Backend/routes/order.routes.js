const express = require('express')
const routes = express.Router()
const Order = require('../models/order.models')
const Cart = require('../models/cart.models')
const auth = require('../middleware/auth')


routes.post('/add-order', auth, async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products in order." });
        }
        products.forEach((item, i) => {
            console.log(`Product ${i + 1}:`, item);
        });


        let findOrder = await Order.findOne({ user_id });

        if (findOrder) {
            findOrder.products.push(...products)
            await findOrder.save();
            if (products.length > 1) {
                await Cart.findOneAndUpdate(
                    { user_id },
                    {
                        $set: {
                            products: [],
                            totalPrice: 0
                        }
                    }
                );
            }

            return res.status(201).json({ message: 'Order Successful', order: findOrder });
        } else {
            const OrderSave = new Order({
                user_id,
                products
            });

            const saveOrder = await OrderSave.save();

            if (products.length > 1) {
                await Cart.findOneAndUpdate(
                    { user_id },
                    {
                        $set: {
                            products: [],
                            totalPrice: 0
                        }
                    }
                );
            }

            return res.status(201).json({ message: 'Order Successful', order: saveOrder });
        }
    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
routes.get('/getorder', auth, async (req, res) => {
    try {
        const user_id = req.user.userId;

        const getOrders = await Order.find({ user_id })
            .populate({
                path: 'products.product_id',
                model: 'Product'
            });

        return res.status(200).json({
            success: true,
            message: getOrders.length === 0 ? 'No orders found for this user.' : 'Orders fetched successfully.',
            orders: getOrders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});





module.exports = routes