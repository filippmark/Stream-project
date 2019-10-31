import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "koa-cors";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
const graphqlHTTP = require("koa-graphql");
import { schema, cleanSchema } from "./graphql/schema/index";
import { usualResolvers, complexResolvers } from "./graphql/resolvers/index";
import { Sequelize } from "sequelize";
import {
  createChatRoomTable,
  belongsToManyUsers,
  roomHasManyMessages
} from "./models/ChatRoom";
import { createChatRoomMemberTable } from "./models/ChatRoomMembers";
import {
  createUserTable,
  belongsToManyRooms,
  userHasManyMessages
} from "./models/User";
import { createMessageTable } from "./models/Message";
import { ApolloServer, gql, PubSub} from 'apollo-server-koa';

const PORT = 8081;
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
  ctx.body = "Hello world!";
});

const typeDefs = gql(cleanSchema);

const pubSub = new PubSub();

const server = new ApolloServer({typeDefs, resolvers: complexResolvers, context: { pubSub},});


server.applyMiddleware({ app });

const httpServer = createServer(app.callback());

server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(server.subscriptionsPath);
})

export { sequelize };