import express from 'express';
import routes from './src/routes/imageRoutes.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

//mongoose set up
mongoose.connect('mongodb://localhost:27017/imagesDB');

//express use set ups
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passing apps to routes function to activate all the routes
routes(app);

//start server to PORT
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
