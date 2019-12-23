import { ChatRoom } from "../../models/ChatRoom";
import { User } from "../../models/User";
import { Op } from "sequelize";
import { PubSub } from "apollo-server-koa";
import { withFilter } from "apollo-server-koa";

const pubSub = new PubSub();

export const chatRooms = async (parent: any, args: any) => {
  try {
    const id = args.id;
    const user = await User.findByPk(id);
    const rooms = await user.getChatRooms();
    return rooms.map((room: any) => {
      const roomValues = room.dataValues;
      const amountOfUsers = room.countUsers();
      return {
        ...roomValues,
        amountOfUsers
      };
    });
  } catch (error) {
    throw error;
  }
};

export const isExistChatRoom = async (
  parent: any,
  args: {
    isExistChatRoomInput: { userSenderId: number; userRecipientId: number };
  }
) => {
  const { userSenderId, userRecipientId } = args.isExistChatRoomInput;
  try {
    const userSender = await User.findByPk(userSenderId);
    const userRecipient = await User.findByPk(userRecipientId);
    let chats = await userSender.getChatRooms({
      where: {
        name: { [Op.like]: `%${userSender.email} ${userRecipient.email}%` }
      }
    });
    chats = chats.filter(async (chat: any) => {
      const users = await chat.getUsers();
      return users.length === 2;
    });
    if (chats.length === 0) {
      return null;
    } else {
      const chat = chats[0];
      const amount = await chat.countUsers();
      return { ...chat.dataValues, amountOfUsers: amount };
    }
  } catch (error) {
    throw error;
  }
};

export const createChatRoom = async (
  parent: any,
  args: {
    createChatRoomInput: { userSenderId: number; userRecipientId: number };
  }
) => {
  const { userSenderId, userRecipientId } = args.createChatRoomInput;
  try {
    const userSender = await User.findByPk(userSenderId);
    const userRecipient = await User.findByPk(userRecipientId);
    const chatRoom = await ChatRoom.create({
      name: `${userSender.email} ${userRecipient.email}`,
      creatorId: userSenderId
    });
    await chatRoom.addUser(userSender);
    await chatRoom.addUser(userRecipient);
    const amountOfUsers = await chatRoom.countUsers();
    pubSub.publish("chatCreated", {
      chatCreated: { ...chatRoom.dataValues, amountOfUsers, userSenderId, userRecipientId }
    });
    return { ...chatRoom.dataValues, amountOfUsers };
  } catch (error) {
    throw error;
  }
};

export const chatCreated = {
  subscribe: withFilter(
    () => pubSub.asyncIterator("chatCreated"),
    (payload, variables) => {
      return (
        payload.chatCreated.userRecipientId == variables.userId ||
        payload.chatCreated.userSenderId == variables.userId
      );
    }
  )
};