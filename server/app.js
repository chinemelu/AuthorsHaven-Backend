import express from 'express';
import graphqlHTTP from 'express-graphql';
import client from './models';
import EmailHelperClass from './helper/EmailHelperClass';
import UserHelperClass from './helper/UserHelperClass';
import schema from './schema';
import rootResolver from './resolvers';


const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true
}));
app.get('/api/v1/verify/:token', EmailHelperClass.verifyEmail);
app.get('/api/v1/password_reset/:token', UserHelperClass
  .verifyUserIdentityFromTokenParams);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectToServer = async () => {
  const applicationServer = await client();
  if (applicationServer) {
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on port 3000');
    });
  }
};

connectToServer();


export default app;
