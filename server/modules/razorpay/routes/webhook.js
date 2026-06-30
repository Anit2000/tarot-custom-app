import handleRazorpayAbandonedCheckout from "../controllers/abandonedCheckout.js";

const razorpayWebhookHandler = async (req, res) => {
  try {
    console.log('abandoned hit')
    handleRazorpayAbandonedCheckout(req.body);
    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.log("Failed to handle razorpay webhook reason -->" + err.message);
  }
};

export default razorpayWebhookHandler;
