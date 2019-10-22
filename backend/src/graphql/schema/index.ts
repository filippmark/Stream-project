const { buildSchema } = require("graphql");

module.exports =  buildSchema(`
    
    input UserInput{
        email:  String!
        password: String
    }

    type User{
        _id: ID!
        email:  String!
        password: String
    }

    type RootQuery{
        login(userInput: UserInput!): User!
    }

    type RootMutation{
        createNewUser(userInput: UserInput!): User!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
