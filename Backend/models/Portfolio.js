const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    settings: { type: Object, required: true },
    sections: { type: Array, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
