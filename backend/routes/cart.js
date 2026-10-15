const express = require('express');
const router = express.Router();
const cartSession = require('../middleware/cartSession');
const { getCart, saveCart } = require('../controllers/cart');

router.get('/cart', cartSession, getCart);
router.put('/cart', cartSession, saveCart);

module.exports = router;
