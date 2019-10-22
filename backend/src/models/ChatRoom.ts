const { Model, DataTypes } = require("sequelize");
const User = require("./User");

export default class ChatRoom extends Model {
  public id!: number;
  public name!: string;
}

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
    }
  },
  {
    tablename: "chatRooms",
    sequelize
  }
);

ChatRoom.hasMany(User);
