/* eslint-disable no-console */

const AWS = require('aws-sdk');

const region = 'us-east-1';
const stackName = 'collector-elasticsearch';
const userPoolDomainName = stackName;

/**
 * Configure resources that cloudformation doesn't support
 */
const main = async () => {
  AWS.config.update({ region });

  const cloudformation = new AWS.CloudFormation();
  const es = new AWS.ES();
  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

  // Read the outputs of the stack we're configuring
  const { Stacks: stacks } = await cloudformation
    .describeStacks({
      StackName: stackName
    })
    .promise();

  // Map outputs to `key: value` pairs
  const outputs = stacks[0].Outputs.reduce((memo, out) => {
    memo[out.OutputKey] = out.OutputValue;

    return memo;
  }, {});

  // Create or update our user pool domain
  const { UserPool: userPool } = await cognitoIdp
    .describeUserPool({
      UserPoolId: outputs.UserPoolId
    })
    .promise();

  const shouldUpdateUserPoolDomain =
    userPool.Domain && userPool.Domain !== userPoolDomainName;

  if (shouldUpdateUserPoolDomain) {
    console.log('Removing existing user pool domain:', userPool.Domain);

    await cognitoIdp
      .deleteUserPoolDomain({
        Domain: userPool.Domain,
        UserPoolId: outputs.UserPoolId
      })
      .promise();
  }

  if (!userPool.Domain || shouldUpdateUserPoolDomain) {
    console.log('Creating user pool domain:', userPoolDomainName);

    await cognitoIdp
      .createUserPoolDomain({
        Domain: userPoolDomainName,
        UserPoolId: outputs.UserPoolId
      })
      .promise();
  }

  console.log('Creating/Updating ES Authentication');
  await es
    .updateElasticsearchDomainConfig({
      DomainName: outputs.ElasticsearchDomainName,
      CognitoOptions: {
        Enabled: true,
        UserPoolId: outputs.UserPoolId,
        IdentityPoolId: outputs.IdentityPoolId,
        RoleArn: outputs.EsCognitoServiceRole
      }
    })
    .promise();

  console.log('Done configuring services');

  console.log(
    'To create or edit user logins, visit',
    `https://console.aws.amazon.com/cognito/users/?region=${region}&#/pool/${
      outputs.UserPoolId
    }/users`
  );
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
