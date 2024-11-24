const { Cart } = require('../models/cartModel');
const Product = require('../models/productModel')
const express = require('express');
const router = express.Router();

router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findById(userId);

        if (!cart) {
            cart = new Cart({ _id: userId, products: [] });
        }
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId
        );
        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        return res.status(200).json({ message: 'Added to cart successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error adding to cart' });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findById(userId).populate({
            path: 'products.productId',
            model: 'products',
        });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching cart' });
    }
});


module.exports = router;
