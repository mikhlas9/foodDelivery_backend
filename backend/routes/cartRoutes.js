const express = require('express');
const { addTocart, getCartItems, updateCartQuantity, deleteCartItem, clearCart } = require('../controllers/cartController');
const router = express.Router();

const protect = require("../middleware/authMiddleware")

// User Registration
router.post('/add-to-cart',addTocart);
router.get('/cart',getCartItems);
router.put('/cart/updateQuantity', updateCartQuantity);
router.delete("/cart/delete", deleteCartItem);
router.delete("/cart/clear", clearCart);




module.exports = router;
