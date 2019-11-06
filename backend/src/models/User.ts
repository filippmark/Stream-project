import { Model, DataTypes } from "sequelize";
import { BelongsToManyGetAssociationsMixin } from 'sequelize';
import * as bcrypt from "bcrypt";
import { ChatRoom } from "./ChatRoom";
import { ChatRoomMember } from "./ChatRoomMembers";
import { Message } from './Message';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;

  public getChatRooms!: BelongsToManyGetAssociationsMixin<ChatRoom>; 
}

export function createUserTable(sequelize: any) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: new DataTypes.STRING(255),
        allowNull: false
      },
      password: {
        type: new DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      hooks: {
        beforeCreate: async (user: User, options: any) => {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      tableName: "users",
      sequelize: sequelize
    }
  );
}

export function belongsToManyRooms() {
  User.belongsToMany(ChatRoom, { through: ChatRoomMember });
}

export function userHasManyMessages(){
  User.hasMany(Message);
}