const express = require('express');
const router = express.Router();
const {
  addFunds,
  addPickupPartner,
  transferFunds,
  getDashboard,
  getMcpId,
  getWallet,
  getPickupPartners,
  deletePartner, // Added deletePartner to the destructuring
} = require('../controllers/mcpController');

// Define routes
router.post('/:id/add-funds', addFunds);
router.post('/:id/add-partner', addPickupPartner);
router.post('/:mcpId/transfer-funds/:partnerId', transferFunds);
router.get('/:id/dashboard', getDashboard);
router.get('/get-mcp-id', getMcpId);
router.get('/:id/pickup-partners', getPickupPartners);
router.get('/wallet/:id', getWallet);
router.delete('/pickup-partners/:id', deletePartner); // Added the DELETE route

module.exports = router;