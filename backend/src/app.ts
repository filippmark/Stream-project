const Koa = require("koa");
const Router = require("koa-router");
const graphqlHTTP = require("koa-graphql");
const mount = require("koa-mount");
const schema = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");
const { Sequelize } = require("sequelize");

const app = new Koa();
const router = new Router();

const sequelize = new Sequelize("twitch", "root", "123456", {
    dialect: "mysql",
    host: "0.0.0.0",
    port: "3310"
});

sequelize.sync().then((result: any)=>{
    console.log(result);
  })
  .catch((err: any)=> console.log(err));

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
