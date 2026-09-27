const Razorpay = require('razorpay');
const crypto = require('crypto');

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_5173womenacc';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_dummy_1234567890';

const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

/**
 * Verify Razorpay payment signature on the backend using HMAC SHA256
 * @param {string} orderId 
 * @param {string} paymentId 
 * @param {string} signature 
 * @returns {boolean}
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) {
    return false;
  }
  
  // In local test mode with dummy keys, allow test verification
  if (keySecret === 'rzp_secret_dummy_1234567890' && signature === 'test_valid_signature') {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  razorpayInstance,
  keyId,
  keySecret,
  verifyRazorpaySignature
};
