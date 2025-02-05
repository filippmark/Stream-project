import { Message } from "../../models/Message";
import { PubSub } from "apollo-server-koa";
import { withFilter } from "apollo-server-koa";

interface IArgsCreateMessage {
  messageInput: IMessageInput;
}

interface IMessageInput {
  text: String;
  chatRoomId: number;
  creatorId: number;
}

interface IMessage {
  id: number;
  text: string;
  chatRoomId: number;
  userId: number;
}

interface IArgsLastMessages {
  lastMessagesInput: ILastMessagesInput;
}

interface ILastMessagesInput {
  amount: number;
  chatRoomId: number;
}

const pubSub = new PubSub();

export const createMessage = async (
  parent: any,
  args: IArgsCreateMessage
): Promise<IMessage> => {
  console.log(args.messageInput);
  const { text, chatRoomId, creatorId } = args.messageInput;
  const message = await Message.create({
    text,
    ChatRoomId: chatRoomId,
    UserId: creatorId
  });
  console.log(message.dataValues);
  await pubSub.publish("messageAdded", { messageAdded: message.dataValues });
  return { ...message.dataValues };
};

export const lastMessages = async (
  parent: any,
  args: IArgsLastMessages
): Promise<[IMessage]> => {
  const { amount, chatRoomId } = args.lastMessagesInput;
  const messages = await Message.findAll({
    limit: amount,
    where: {
      ChatRoomId: chatRoomId
    },
    order: [["id", "DESC"]]
  });
  return messages.map((message: any) => message.dataValues).reverse();
};

export const messageAdded = {
    subscribe: withFilter(
      () => pubSub.asyncIterator("messageAdded"),
      (payload, variables) => {
        return payload.messageAdded.ChatRoomId === variables.chatRoomId;
      }
    )
  };
