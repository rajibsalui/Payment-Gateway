const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createSubscription,
  getSubscriptions
} = require('../controllers/subscriptionController');

router.post('/create', auth, createSubscription);
router.get('/', auth, getSubscriptions);

module.exports = router;