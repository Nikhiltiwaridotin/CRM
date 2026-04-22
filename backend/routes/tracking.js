const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

router.get('/:tracking_id', trackingController.getTracking);

module.exports = router;
