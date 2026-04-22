const bcrypt = require('bcryptjs');
const { Customer } = require('./models');

async function checkPassword() {
  const admin = await Customer.findOne({ where: { email: 'admin@solar.com' } });
  const isMatch = await bcrypt.compare('admin123', admin.password);
  console.log('Password match:', isMatch);
  process.exit();
}
checkPassword();
