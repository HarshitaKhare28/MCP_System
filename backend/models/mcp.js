const mongoose = require('mongoose');

const mcpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  pickupPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PickupPartner' }],
});

module.exports = mongoose.model('MCP', mcpSchema);