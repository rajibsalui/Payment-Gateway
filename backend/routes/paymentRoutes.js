const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const fraudDetection = require('../middlewares/fraudDetection');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory
} = require('../controllers/paymentController');

router.post('/create-payment-intent', auth, fraudDetection, createPaymentIntent);
router.post('/confirm-payment', auth, confirmPayment);
router.get('/history', auth, getPaymentHistory);

module.exports = router;
