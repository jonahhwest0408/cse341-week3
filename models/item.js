const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    category: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
