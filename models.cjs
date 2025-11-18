const mongoose = require('mongoose');

// Stall Schema
const stallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  owner_email: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  stall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

// Order Item Schema (subdocument)
const orderItemSchema = new mongoose.Schema({
  menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  item_name: { type: String, required: true }
}, { _id: false });

// Order Schema
const orderSchema = new mongoose.Schema({
  stall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall', required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  pickup_time: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed'],
    default: 'pending'
  },
  total_amount: { type: Number, required: true, min: 0 },
  items: [orderItemSchema],
  created_at: { type: Date, default: Date.now }
});

const Stall = mongoose.model('Stall', stallSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Stall, MenuItem, Order };
