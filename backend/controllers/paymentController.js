const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/User');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', description } = req.body;
    const userId = req.user._id;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      customer: req.user.stripeCustomerId,
      metadata: { userId: userId.toString() }
    });

    // Save payment record
    const payment = new Payment({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      description,
      status: 'pending'
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Update payment status
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { status: paymentIntent.status }
    );

    res.json({ status: paymentIntent.status });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory
};