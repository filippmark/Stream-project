import * as Koa from "koa";
import * as Router from "koa-router";
import * as cors from "koa-cors";
import { createServer } from "http";
import { cleanSchema } from "./graphql/schema/index";
import { complexResolvers } from "./graphql/resolvers/index";
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
import { ApolloServer, gql } from "apollo-server-koa";
import { nms } from "./node-media-server";
import { getUser } from "./helpers/getUser";
import { verify }  from 'jsonwebtoken';

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

const server = new ApolloServer({
  typeDefs: cleanSchema,
  resolvers: complexResolvers,
  context: ({ctx, connection}) => {
    let user = null;
    let token: string = '';

    if(ctx){
      token = ctx.request.header.authorization.split(" ")[1];
    }else if(connection){
      token = connection.context.headers.Authorization.split(" ")[1];
    }
    
    
    try {
      if(token)
        user = verify(token, "filimon777");
    } catch (error) {
      console.log(error);
    }

    console.log(user);
    return { user };
  }
});

server.applyMiddleware({ app });

const httpServer = createServer(app.callback());

server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(server.subscriptionsPath);
});

nms.run();

export { sequelize, httpServer };
