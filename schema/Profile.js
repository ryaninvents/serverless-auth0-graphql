const G = require('graphql');

module.exports = new G.GraphQLObjectType({
    name: 'Profile',
    fields: {
        name: {
            type: new G.GraphQLNonNull(G.GraphQLString),
        },
        email: {
            type: new G.GraphQLNonNull(G.GraphQLString),
        },
        picture: {
            type: new G.GraphQLNonNull(G.GraphQLString),
        },
        gender: {
            type: new G.GraphQLNonNull(G.GraphQLString),
        },
    }
})