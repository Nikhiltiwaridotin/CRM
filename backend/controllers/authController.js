const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Customer } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'customer'
    });
    const token = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, role: customer.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    const customer = await Customer.findOne({ where: { email } });
    
    if (!customer) {
      console.log('User not found in DB');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('User found, checking password...');
    const isMatch = await bcrypt.compare(password, customer.password);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful, generating token');
    const token = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, role: customer.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
