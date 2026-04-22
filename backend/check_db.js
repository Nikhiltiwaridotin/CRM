const { Customer } = require('./models');

async function checkUser() {
  try {
    const admin = await Customer.findOne({ where: { email: 'admin@solar.com' } });
    if (admin) {
      console.log('Admin user found:', admin.email);
      console.log('Role:', admin.role);
    } else {
      console.log('Admin user NOT found in database.');
    }
  } catch (err) {
    console.error('Error checking user:', err);
  } finally {
    process.exit();
  }
}

checkUser();
