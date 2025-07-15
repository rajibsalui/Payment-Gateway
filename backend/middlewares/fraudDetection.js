const fraudDetection = (req, res, next) => {
  const { amount, email } = req.body;
  
  // Simple fraud detection rules
  if (amount > 10000) {
    return res.status(400).json({ error: 'Amount exceeds maximum limit' });
  }
  
  // Check for suspicious patterns (basic example)
  if (email && email.includes('fraud')) {
    return res.status(400).json({ error: 'Suspicious activity detected' });
  }
  
  next();
};

module.exports = fraudDetection;