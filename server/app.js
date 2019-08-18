import express from 'express';
import graphqlHTTP from 'express-graphql';
import { connectToDb } from './models';
import schema from './schema';
import rootResolver from './resolvers';


const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectToServer = async () => {
  const applicationServer = await connectToDb();
  if (applicationServer) {
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on port 3000');
    });
  }
};

connectToServer();


export default app;
