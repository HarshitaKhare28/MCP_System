const mongoose = require('mongoose');

const pickupPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  completedOrders: { type: Number, default: 0 },
});

module.exports = mongoose.model('PickupPartner', pickupPartnerSchema);