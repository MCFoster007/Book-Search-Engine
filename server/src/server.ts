// import express from 'express';
// import path from 'node:path';
// import db from './config/connection.js';
// import routes from './routes/index.js';

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });



import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { typeDefs, resolvers } from './schema/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors());
app.use(express.json());
app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/graphql`);
});
