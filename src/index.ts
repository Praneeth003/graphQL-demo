import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './schema.js';
import db from './data.js';

const app = express();


const resolvers = {
    Query: {
        games: () => db.games,
        reviews: () => db.reviews,
        authors: () => db.authors,
    },
    };

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000/`);
});

