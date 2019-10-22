const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

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
    }
  },
  {
    tableName: "users"
  }
);

module.exports = User;