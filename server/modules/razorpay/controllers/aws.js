import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
/**
 *
 * @typedef {object} payload
 * @param {string} orderId - shopify order id
 * @param {object} result - error object
 */
const sendMessageFailureToDynamoDb = async ({
  webhookId,
  error,
  payload,
}) => {
  try {
    const dynamo = new AWS.DynamoDB();

    await dynamo
      .putItem({
        TableName: "WEBHOOK_FAILURES",
        Item: {
          WEBHOOK_ID: { S: `${webhookId}` },
          CREATED_AT: { S: String(Date.now()) },
          errorPayload: { S: JSON.stringify(payload) },
        },
        ConditionExpression: "attribute_not_exists(PK)",
      })
      .promise();
  } catch (err) {
    console.error("DYNAMODB_WEBHOOK_FAILURE_WRITE_FAILED", {
      webhookId,
      error: err.message,
    });
  }
};
export { sendMessageFailureToDynamoDb };
