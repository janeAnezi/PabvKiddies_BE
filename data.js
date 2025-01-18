const mongoose = require('mongoose');
const Product = require('./models/product');
const products = require('./product'); 

require('dotenv').config();

const uri = process.env.MONGO_URI;

const seedProducts = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Database connected');

    await Product.deleteMany();
    console.log('Existing products deleted');

    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
