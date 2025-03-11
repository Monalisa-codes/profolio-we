// models/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Portfolio',
    },
    items: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
