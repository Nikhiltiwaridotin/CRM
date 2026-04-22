const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { adminAuth, auth } = require('../middleware/auth');

router.get('/', inventoryController.getProducts);
router.get('/:id', inventoryController.getProductById);
router.post('/', adminAuth, inventoryController.createProduct);
router.put('/:id', adminAuth, inventoryController.updateProduct);
router.delete('/:id', adminAuth, inventoryController.deleteProduct);

module.exports = router;
