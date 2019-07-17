import express from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/ah_angular_backend', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(process.env.PORT, () => {
  console.log('listening on port 3000');
});
