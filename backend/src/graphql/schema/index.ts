import { buildSchema } from "graphql";

export const schema = buildSchema(`
    
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
        id: ID!
        email:  String!
        password: String
    }

    type ChatRoom{
        id: ID!
        name: String!
    }

    type RootQuery{
        login(userInput: UserInput!): AuthData!
        chatRooms(id: ID!): [ChatRoom!]
    }

    type RootMutation{
        createNewUser(userInput: UserInput!): User!
        createChatRoom(name: String!): ChatRoom!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
