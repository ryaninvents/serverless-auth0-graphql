/* handler.js */
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')
const server = require('apollo-server-lambda');
const AuthenticationClient = require('auth0').AuthenticationClient;
const Profile = require('./schema/Profile');

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

const auth0 = new AuthenticationClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
});

// This method just inserts the user's first name into the greeting message.
const getGreeting = firstName => `Hello, ${firstName}.`;

// Here we declare the schema and resolvers for the query
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // an arbitrary name
    fields: {
      // the query has a field called 'greeting'
      greeting: {
        // we need to know the user's name to greet them
        args: { firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) } },
        // the greeting message is a string
        type: GraphQLString,
        // resolve to a greeting message
        resolve: (parent, args) => getGreeting(args.firstName)
      },
      now: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: () => new Date().toISOString(),
      },
      profile: {
        type: Profile,
        resolve: (parent, args, ctx) => {
          const idToken = ctx.headers.Authorization.split(' ')[1];
          return auth0.tokens.getInfo(idToken);
        }
      }
    },
  }),
});
  
exports.graphqlHandler = server.graphqlLambda((event, context) => {
  const headers = event.headers,
    functionName = context.functionName;
 
  return {
    schema,
    context: {
      headers,
      functionName,
      event,
      context
    }
  };
});

exports.graphiqlHandler = server.graphiqlLambda({
    endpointURL: '/api/graphql',
    passHeader: "'Authorization': 'Bearer ' + localStorage.getItem('id_token'),"
});

exports.echo = (event, context, callback) => callback(null, {event, context});