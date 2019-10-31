import { ChatRoom } from "../../models/ChatRoom";

interface IChatRoom {
  id: number;
  name: string;
}

export const chatRooms = async (parent: any, args: any): Promise<IChatRoom[]> => {
  try {
    const rooms = await ChatRoom.findAll({ where: { creatorId: 15 } });
    return rooms.map((room: { dataValues: any }) => room.dataValues);
  } catch (error) {
    throw error;
  }
};

export const createChatRoom = async (parent: any, args: {
  name: string;
}): Promise<IChatRoom> => {
  const name = args.name;
  try {
    const room = await ChatRoom.create({ name, creatorId: 15 });
    return room.dataValues;
  } catch (error) {
    throw error;
  }
};
