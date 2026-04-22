const { Order, OrderItem, Product, TrackingHistory, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { customerId, items } = req.body; // items: [{ productId, quantity }]
    let totalAmount = 0;

    // Validate stock and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product || product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product ? product.name : item.productId}`);
      }
      totalAmount += product.price * item.quantity;
    }

    const trackingId = uuidv4();
    const order = await Order.create({
      customerId,
      totalAmount,
      trackingId,
      status: 'Pending'
    }, { transaction: t });

    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity
      }, { transaction: t });

      // Deduct stock
      await Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t
      });
    }

    // Initial tracking history
    await TrackingHistory.create({
      trackingId,
      status: 'Order Placed',
      location: 'Warehouse'
    }, { transaction: t });

    await t.commit();

    // Emit socket event (handled in server.js or a separate utility)
    if (req.app.get('socketio')) {
        req.app.get('socketio').emit('orderUpdate', { orderId: order.id, status: order.status });
    }

    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem, TrackingHistory] });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();

    await TrackingHistory.create({
      trackingId: order.trackingId,
      status: status,
      location: location || 'In Transit'
    });

    if (req.app.get('socketio')) {
        const io = req.app.get('socketio');
        io.emit('orderUpdate', { orderId: order.id, status: order.status, trackingId: order.trackingId });
        io.to(order.trackingId).emit('statusChange', { status, location, timestamp: new Date() });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
