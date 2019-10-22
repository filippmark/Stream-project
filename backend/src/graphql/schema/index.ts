const { buildSchema } = require("graphql");

module.exports =  buildSchema(`
    
    input UserInput{
        email:  String!
        password: String
    }

    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type User{
        _id: ID!
        email:  String!
        password: String
    }

    type ChatRoomInput{
        name: String!
        creator: ID!
    }

    type ChatRoom{
        _id: ID!
        name: String!
    }

    type RootQuery{
        login(userInput: UserInput!): AuthData!
        chatRooms(userId: ID!): [ChatRoom!]
    }

    type RootMutation{
        createNewUser(userInput: UserInput!): User!
        createChatRoom(chatRoomInput: ChatRoomInput!): ChatRoom!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
