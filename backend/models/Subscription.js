const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeSubscriptionId: { type: String, required: true },
  status: { type: String, enum: ['active', 'canceled', 'incomplete'], default: 'active' },
  priceId: { type: String, required: true },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);