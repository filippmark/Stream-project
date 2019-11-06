import { buildSchema } from "graphql";


export const cleanSchema = `     
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
        amountOfUsers: Int!
        creatorId: ID!
    }


    input MessageInput{
        text: String!
        chatRoomId: ID!
        creatorId: ID!
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

    input IsExistChatroomInput{
        userSenderId: ID!
        userRecipientId: ID!
    }

    input CreateChatRoomInput{
        userSenderId: ID!
        userRecipientId: ID!
    }

    type RootQuery{
        login(userInput: UserInput!): AuthData!
        chatRooms(id: ID!): [ChatRoom!]
        lastMessages(lastMessagesInput: LastMessagesInput!): [Message!]
        usersByEmail(partOfName: String!): [User!]
        isExistChatRoom(isExistChatRoomInput:  IsExistChatroomInput!): ChatRoom 
    }

    type RootMutation{
        createNewUser(userInput: UserInput!): User!
        createChatRoom(createChatRoomInput: CreateChatRoomInput!): ChatRoom!
        createMessage(messageInput: MessageInput!):Message!
    }

    type Subscription {
        messageAdded(chatRoomId: ID!): Message
        chatCreated(userId: ID!): ChatRoom
    }

    schema{
        query: RootQuery
        mutation: RootMutation
        subscription: Subscription
    }
`

export const schema = buildSchema(cleanSchema);