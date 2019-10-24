import * as Koa from "koa";
import * as Router from "koa-router";
const graphqlHTTP = require("koa-graphql");
import * as mount from "koa-mount";
import { schema } from "./graphql/schema/index";
import resolvers from "./graphql/resolvers/index";
import { Sequelize } from "sequelize";
import { createChatRoomTable, belongsToManyUsers } from "./models/ChatRoom";
import { createChatRoomMemberTable } from "./models/ChatRoomMembers";
import { createUserTable, belongsToManyRooms } from "./models/User";

const app = new Koa();
const router = new Router();

const sequelize = new Sequelize("twitch", "root", "123456", {
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3307
});

createChatRoomMemberTable(sequelize);
createChatRoomTable(sequelize);
createUserTable(sequelize);
belongsToManyRooms();
belongsToManyUsers();

sequelize
  .sync()
  .then((result: any) => {})
  .catch((err: any) => console.log(err));

router.get("/", async (ctx: any) => {
  ctx.body = "Hel1lo world!";
});

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true
    })
  )
);

app.use(router.routes());

app.listen(8081);

export { sequelize };
