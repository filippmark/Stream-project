import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "koa-cors";
const graphqlHTTP = require("koa-graphql");
import * as mount from "koa-mount";
import { schema } from "./graphql/schema/index";
import resolvers from "./graphql/resolvers/index";
import { Sequelize } from "sequelize";
import { createChatRoomTable, belongsToManyUsers, roomHasManyMessages } from "./models/ChatRoom";
import { createChatRoomMemberTable } from "./models/ChatRoomMembers";
import { createUserTable, belongsToManyRooms, userHasManyMessages } from "./models/User";
import { createMessageTable } from "./models/Message";

const app = new Koa();
const router = new Router();

app.use(cors());

const sequelize = new Sequelize("twitch", "root", "123456", {
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3307
});

createChatRoomMemberTable(sequelize);
createChatRoomTable(sequelize);
createUserTable(sequelize);
createMessageTable(sequelize);
belongsToManyRooms();
belongsToManyUsers();
roomHasManyMessages();
userHasManyMessages();

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
      graphiql: true,
    })
  )
);

app.use(router.routes());

app.listen(8081);

export { sequelize };
