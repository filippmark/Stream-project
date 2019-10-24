import { ChatRoom } from "../../models/ChatRoom";

interface IChatRoom {
  id: number;
  name: string;
}

export const chatRooms = async (args: any): Promise<IChatRoom[]> => {
  try {
    const rooms = await ChatRoom.findAll({ where: { creatorId: 1 } });
    return rooms.map((room: { dataValues: any }) => room.dataValues);
  } catch (error) {
    throw error;
  }
};

export const createChatRoom = async (args: {
  name: string;
}): Promise<IChatRoom> => {
  const name = args.name;
  try {
    const room = await ChatRoom.create({ name, creatorId: 1 });
    return room.dataValues;
  } catch (error) {
    throw error;
  }
};
