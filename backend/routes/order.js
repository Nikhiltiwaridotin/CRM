const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/create', auth, orderController.createOrder);
router.get('/', adminAuth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', adminAuth, orderController.updateOrderStatus);

module.exports = router;
