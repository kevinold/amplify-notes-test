exports.handler = async (event, context, callback) => {
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        user_groups: "test-group1"
      }
    }
  };
  // Return to Amazon Cognito
  callback(null, event);
};
