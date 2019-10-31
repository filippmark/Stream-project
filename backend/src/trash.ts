
/*
router.all(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: usualResolvers,
    graphiql: true,
  })
);

app.use(router.routes());

const server = createServer(app.callback());

server.listen(PORT, () => {
  new SubscriptionServer(
    {
      schema: makeExecutableSchema({typeDefs: cleanSchema, resolvers: complexResolvers}),
      execute,
      subscribe,
    },
    {
      server,
      path: "/subscriptions"
    }
  );
});*/


/*const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs: cleanSchema, resolvers: usualResolvers, context: { pubsub } })

server.start(() => console.log('Server is running on localhost:4000'))*/
