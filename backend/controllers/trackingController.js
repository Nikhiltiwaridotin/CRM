const { Order, TrackingHistory } = require('../models');

exports.getTracking = async (req, res) => {
  try {
    const { tracking_id } = req.params;
    const order = await Order.findOne({
      where: { trackingId: tracking_id },
      include: [TrackingHistory]
    });

    if (!order) {
      return res.status(404).json({ error: 'Tracking ID not found' });
    }

    res.json({
      orderId: order.id,
      status: order.status,
      trackingId: order.trackingId,
      totalAmount: order.totalAmount,
      TrackingHistories: order.TrackingHistories,
      createdAt: order.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
