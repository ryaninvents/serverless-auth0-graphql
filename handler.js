/* handler.js */
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')
const server = require('apollo-server-lambda');

// This method just inserts the user's first name into the greeting message.
const getGreeting = firstName => `Hello, ${firstName}.`

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
    },
  }),
});

// We want to make a GET request with ?query=<graphql query>
// The event properties are specific to AWS. Other providers will differ.
module.exports.query = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
  .then(
    result => callback(null, {statusCode: 200, body: JSON.stringify(result)}),
    err => callback(err)
  )
  
exports.graphqlHandler = server.graphqlLambda({ schema });
exports.graphiqlHandler = server.graphiqlLambda({
    endpointURL: '/api/graphql',
    passHeader: "'Authorization': 'Bearer ' + localStorage.getItem('id_token'),"
});

exports.echo = (event, context, callback) => callback(null, {event, context});