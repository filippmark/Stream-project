import { Model, DataTypes } from "sequelize";
import { sequelize } from "../app";

export class ChatRoomMember extends Model {
  public isAdmin!: boolean;
}

export function createChatRoomMemberTable(sequelize: any) {
  ChatRoomMember.init(
    {
      isAdmin: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: "chatRoomMembers",
      sequelize: sequelize
    }
  );
}