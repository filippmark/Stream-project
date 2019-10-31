import { login, createNewUser } from "./user";
import { chatRooms, createChatRoom } from "./chatRoom";
import { createMessage, lastMessages, Subscription } from './message';

export const usualResolvers = {
  login,
  createNewUser,
  chatRooms,
  createChatRoom,
  createMessage,
  lastMessages,
  Subscription
};

export const complexResolvers = {
  RootQuery: {
    login,
    chatRooms,
    lastMessages
  },
  RootMutation:{
    createMessage,
    createNewUser,
    createChatRoom
  },
  Subscription
}
