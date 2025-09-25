import { ApolloServer } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Extended context interface that includes pubsub
interface MyContext extends BaseContext {
  pubsub: any;
}

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Configure CORS to allow requests from extension, web app, and mobile app
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: [
        'chrome-extension://*',  // Chrome extension
        'http://localhost:3000', // Web development
        'http://localhost:19000', // Expo development
        'https://yourapp.com',   // Production web app
      ],
      credentials: true,
    }),
    express.json(),
    // Add context with pubsub for every request
    expressMiddleware(server, {
      context: async () => ({ pubsub: {} }),
    }),
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
