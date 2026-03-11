const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'shoe'
  },
  description: {
    type: String,
    required: true
  },
  size: {
    type: [Number],
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  rating: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
