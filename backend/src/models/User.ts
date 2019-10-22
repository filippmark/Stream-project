const {  Model, DataTypes } = require("sequelize");

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init({
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
    type: new DataTypes.STRING(65),
    allowNull: true
  }
}, {
    tableName: 'users',
    sequelize
});
