const MCP = require('../models/mcp');
const PickupPartner = require('../models/pickupPartner');

// Add funds to MCP wallet
const addFunds = async (req, res) => {
  const { amount } = req.body;
  try {
    const mcp = await MCP.findById(req.params.id);
    if (!mcp) return res.status(404).json({ error: 'MCP not found' });
    mcp.walletBalance += amount;
    await mcp.save();
    res.json({ message: 'Funds added', walletBalance: mcp.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a Pickup Partner
const addPickupPartner = async (req, res) => {
  const { name } = req.body;
  try {
    const partner = new PickupPartner({ name });
    await partner.save();
    const mcp = await MCP.findById(req.params.id);
    if (!mcp) return res.status(404).json({ error: 'MCP not found' });
    mcp.pickupPartners.push(partner._id);
    await mcp.save();
    res.json({ message: 'Pickup Partner added', partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete a pickup partner
const deletePartner = async (req, res) => {
  try {
    const partnerId = req.params.id;
    const partner = await PickupPartner.findByIdAndDelete(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    // Update MCP to remove the partner reference
    await MCP.updateMany(
      { pickupPartners: partnerId },
      { $pull: { pickupPartners: partnerId } }
    );

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer funds from MCP to Pickup Partner
const transferFunds = async (req, res) => {
  const { amount } = req.body;
  const { mcpId, partnerId } = req.params;
  try {
    const mcp = await MCP.findById(mcpId);
    const partner = await PickupPartner.findById(partnerId);
    if (!mcp || !partner) return res.status(404).json({ error: 'MCP or Partner not found' });
    if (mcp.walletBalance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    mcp.walletBalance -= amount;
    partner.walletBalance += amount;
    await mcp.save();
    await partner.save();
    res.json({ message: 'Funds transferred', mcpBalance: mcp.walletBalance, partnerBalance: partner.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get MCP Dashboard Data
const getDashboard = async (req, res) => {
  try {
    const mcp = await MCP.findById(req.params.id).populate('pickupPartners');
    if (!mcp) return res.status(404).json({ error: 'MCP not found' });
    res.json({
      walletBalance: mcp.walletBalance,
      pickupPartners: mcp.pickupPartners,
      totalOrders: mcp.pickupPartners.reduce((acc, p) => acc + (p.completedOrders || 0), 0),
      completedOrders: mcp.pickupPartners.reduce((acc, p) => acc + (p.completedOrders || 0), 0),
      pendingOrders: 0, // Placeholder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch MCP ID
const getMcpId = async (req, res) => {
  try {
    const mcp = await MCP.findOne();
    if (!mcp) return res.status(404).json({ error: 'No MCP found' });
    res.json({ mcpId: mcp._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Pickup Partners for an MCP
const getPickupPartners = async (req, res) => {
  console.log(req.params.id);
  try {
    const mcp = await MCP.findById(req.params.id).populate('pickupPartners');
    if (!mcp) return res.status(404).json({ error: 'MCP not found' });
    res.json(mcp.pickupPartners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get MCP Wallet Balance
const getWallet = async (req, res) => {
  try {
    const mcp = await MCP.findById(req.params.id);
    if (!mcp) return res.status(404).json({ error: 'MCP not found' });
    res.json({ walletBalance: mcp.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addFunds, addPickupPartner, transferFunds, getDashboard, getMcpId, getPickupPartners,getWallet ,deletePartner};