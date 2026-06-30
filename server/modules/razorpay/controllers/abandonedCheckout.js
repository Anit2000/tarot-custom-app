import { createAbandonedCheckoutEventInInterakt } from "./interakt.js";
import { sendMessageFailureToDynamoDb } from "./aws.js";

const handleRazorpayAbandonedCheckout = async (payload) => {
  try {
    console.log("we got hit here in this case");
    await createAbandonedCheckoutEventInInterakt(payload);
  } catch (err) {
    await sendMessageFailureToDynamoDb({error: err,webhookId: payload.token,payload})
    console.log(
      "Failed to hanlde razorpay abandoned checkout reason -->" + err.message
    );
  }
};

export default handleRazorpayAbandonedCheckout;
