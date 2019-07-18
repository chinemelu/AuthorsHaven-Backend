import express from 'express';
import { connectDb } from './models';

const app = express();

app.get('/', (res) => {
  res.send('Hello world!');
});

connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log('listening on port 3000');
  });
});
