import { Message } from "../../models/Message";

interface IArgsCreateMessage {
  messageInput: IMessageInput;
}

interface IMessageInput {
  text: String;
  chatRoomId: number;
}

interface IMessage {
  id: number;
  text: string;
  chatRoomId: number;
  userId: number;
}

interface IArgsLastMessages{
    lastMessagesInput: ILastMessagesInput
}

interface ILastMessagesInput{
    amount: number
    chatRoomId: number
}

export const createMessage = async (args: IArgsCreateMessage): Promise<IMessage> => {
  const { text, chatRoomId } = args.messageInput;
  const chatRoom = await Message.create({
    text,
    ChatRoomId: chatRoomId,
    UserId: 15
  });
  console.log(chatRoom);
  return {...chatRoom.dataValues};
};

export const lastMessages = async (args: IArgsLastMessages): Promise<[IMessage]> => {
    const {amount, chatRoomId} = args.lastMessagesInput;
    const messages = await Message.findAll({
        limit: amount,
        where: {
            ChatRoomId: chatRoomId
        },
        order: [ ['id', 'DESC'] ]
    });
    return messages.map((message: any) => (message.dataValues))
}