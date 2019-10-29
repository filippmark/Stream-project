import { Model, DataTypes } from "sequelize";

export class Message extends Model {
  public text!: string;
}
                                                                      
export function createMessageTable(sequelize: any) {
  Message.init(
    {
      text: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: "messages",
      sequelize: sequelize
    }
  );
}