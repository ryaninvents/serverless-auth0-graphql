const AuthenticationClient = require('auth0').AuthenticationClient;

const ACCESS_TOKEN_LENGTH = 32;

// Set in `enviroment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

const auth0 = new AuthenticationClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
});

function log(s) {
  console.log(JSON.stringify(s));
}

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    Object.assign(authResponse, {
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }],
      },
    });
  }
  return authResponse;
};

function getToken(params) {
    if (!params.type || params.type !== 'TOKEN') {
        throw new Error("Expected 'event.type' parameter to have value TOKEN");
    }

    var tokenString = params.authorizationToken;
    if (!tokenString) {
        throw new Error("Expected 'event.authorizationToken' parameter to be set");
    }
    
    var match = tokenString.match( /^Bearer (.*)$/ );
    if (!match || match.length < 2) {
        throw new Error("Invalid Authorization token - '" + tokenString + "' does not match 'Bearer .*'");
    }
    return match[1];
}

function getTokenData(token) {
  log({what:'token', token});
  if (token.length === ACCESS_TOKEN_LENGTH) {
    return auth0.users.getInfo(token);
  }
  if (token.length > ACCESS_TOKEN_LENGTH) {
    return auth0.tokens.getInfo(token);
  }
  throw new Error(`Bearer token too short; expected >= ${ACCESS_TOKEN_LENGTH} chars`);
}

function returnAuth0UserInfo(auth0return) {
  log({what:'auth0return', auth0return});
    if (!auth0return) throw new Error( 'Auth0 empty return' );
    if (auth0return === 'Unauthorized') {
        throw new Error('Auth0 reports Unauthorized');
    }

    return auth0return;
}

function getPrincipalId(userInfo) {
  if ( ! userInfo || ! userInfo.user_id ) {
    throw new Error( "No user_id returned from Auth0" );
  }
  console.log( 'Auth0 authentication successful for user_id ' + userInfo.user_id );
    
  return userInfo.user_id;
}

function auth(event, context, callback) {
  const token = getToken(event);
  log({what: 'event', event});
  return getTokenData(token)
    .then(returnAuth0UserInfo)
    .then(getPrincipalId)
    .then((principalId) => 
      generatePolicy(principalId, 'Allow', event.methodArn)
    )
    .then((policy) => callback(null, policy),
    () => callback('Unauthorized'))
}

module.exports.auth = auth;
