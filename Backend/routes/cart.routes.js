const express = require('express')
const routes = express.Router()
const Cart = require('../models/cart.models')
const auth = require('../middleware/auth')

routes.post('/add-cart', auth, async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { product_id, qty, price, size } = req.body;

        let cart = await Cart.findOne({ user_id });

        const ProductItem = {
            product_id,
            price,
            size,
            qty
        };

        if (cart) {
           
            cart.products.push(ProductItem);

            
            cart.totalPrice = cart.products.reduce((sum, p) => sum + p.price, 0);
            await cart.save();
            res.status(200).json(cart);
        } else {
            
            const cartSave = new Cart({
                user_id,
                products: [ProductItem],
                totalPrice: price
            });

            const saveCart = await cartSave.save();
            res.status(201).json(saveCart);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(`Fail To add Item In Cart ${error.message}`);
    }
});


routes.get('/get-cart-product', auth, async (req, res) => {
    try {
        const user_id = req.user.userId;

        const fetchCartProduct = await Cart.findOne({ user_id })
            .populate({
                path: 'products.product_id',
                model: 'Product'
            });


        res.status(201).json(fetchCartProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error Fetching Cart Data: ${error.message}`);
    }
});

routes.patch('/qty_update/:product_id', auth, async (req, res) => {
    try {

        const userId = req.user.userId;
        const product_id = req.params.product_id;
        const { qty, price } = req.body;
        console.log("Received update -> qty:", qty, "price:", price);
        const cart = await Cart.findOne({ user_id: userId }); 

        if (!cart) {
            console.log('Error Fetching Data')
            res.status(404).json({ message: "Cart not found" });
        }

        const productToUpdate = cart.products.find(
            (item) => item.product_id.toString() === product_id
        );

        if (!productToUpdate) {
            console.log('Error Fetching Data')
            return res.status(404).json({ message: "Product not found in cart" });
        }

        productToUpdate.qty = qty;
        productToUpdate.price = price
        cart.totalPrice = cart.products.reduce((sum, p) => sum + p.price, 0)

        await cart.save();

        res.json({ message: "Quantity updated successfully", cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

routes.delete('/delete_cart_item/:product_id', auth, async (req, res) => {
    try {
        const user_id = req.user.userId
        const product_id = req.params.product_id
        const cart = await Cart.findOne({ user_id })
        if (!cart) {
            res.status(404).json({ message: "User Id Not Found" })
        }

        const OriginalLength = cart.products.length
        cart.products = cart.products.filter(
            item => item.product_id.toString() != product_id
        )

        if (cart.products.length === OriginalLength) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price, 0);

        await cart.save()

        res.status(200).json({ message: "Product deleted from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = routes