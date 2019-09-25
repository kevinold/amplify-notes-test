exports.handler = async (event, context, callback) => {
  console.log("EVENT: ", event);
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        user_groups: "test-group1"
      }
    }
  };
  console.log("EVENT Response: ", event);
  // Return to Amazon Cognito
  callback(null, event);
};
