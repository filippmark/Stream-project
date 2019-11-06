import { login, createNewUser, usersByEmail } from "./user";
import { chatRooms, createChatRoom, isExistChatRoom, chatCreated } from "./chatRoom";
import { createMessage, lastMessages, messageAdded } from './message';

export const usualResolvers = {
  login,
  createNewUser,
  chatRooms,
  createChatRoom,
  createMessage,
  lastMessages,
  Subscription:{
    messageAdded,
    chatCreated
  }
};

export const complexResolvers = {
  RootQuery: {
    login,
    chatRooms,
    lastMessages,
    usersByEmail,
    isExistChatRoom
  },
  RootMutation:{
    createMessage,
    createNewUser,
    createChatRoom
  },
  Subscription:{
    messageAdded,
    chatCreated
  }
}
