import { Model, DataTypes, BelongsToManyGetAssociationsMixinOptions, Association } from "sequelize";
import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyCountAssociationsMixin } from "sequelize";
import { User } from "./User";
import { ChatRoomMember } from "./ChatRoomMembers";
import { Message } from "./Message";

export class ChatRoom extends Model {
  public id!: number;
  public name!: string;

  public addUser!: BelongsToManyAddAssociationMixin<User, number>;
  public getUsers!: BelongsToManyGetAssociationsMixin<User>;
  public countUsers!: BelongsToManyCountAssociationsMixin;

  public static associations: {
    chatRoomMembers: Association<User, ChatRoom>;
  }
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

export function belongsToManyUsers(){
  ChatRoom.belongsToMany(User, { through: ChatRoomMember });
}

export function roomHasManyMessages(){
  ChatRoom.hasMany(Message);
}