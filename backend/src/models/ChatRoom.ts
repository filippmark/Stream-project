import { Model, DataTypes } from "sequelize";
import { User } from "./User";
import { ChatRoomMember } from "./ChatRoomMembers";

export class ChatRoom extends Model {
  public id!: number;
  public name!: string;
}

export function createChatRoomTable(sequelize: any) {
  ChatRoom.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(255),
        allowNull: false
      },
      creatorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      tableName: "chatRooms",
      sequelize: sequelize
    }
  );
}

export function belongsToManyUsers() {
  ChatRoom.belongsToMany(User, { through: ChatRoomMember });
}
