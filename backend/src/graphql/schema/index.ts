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


    input MessageInput{
        text: String!
        chatRoomId: ID!
    }

    input LastMessagesInput{
        amount: Int!
        chatRoomId: ID!
    }

    type Message{
        id: ID!
        text: String!
        ChatRoomId: ID!
        UserId: ID!
    }

    type RootQuery{
        login(userInput: UserInput!): AuthData!
        chatRooms(id: ID!): [ChatRoom!]
        lastMessages(lastMessagesInput: LastMessagesInput!): [Message!]
    }

    type RootMutation{
        createNewUser(userInput: UserInput!): User!
        createChatRoom(name: String!): ChatRoom!
        createMessage(messageInput: MessageInput!):Message!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
