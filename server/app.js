import express from 'express';
import morgan from 'morgan';
import ApiResponses from './helper/ApiResponses';
import { connectToDb } from './models';
import user from './routes/user';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));

app.get('/', (res) => {
  res.send('Hello world!');
});
app.use('/api/v1/auth', user);
app.use((req, res) => {
  ApiResponses.status404(res, 'Route does not exist');
});


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
