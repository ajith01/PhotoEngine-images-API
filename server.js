import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { lodash as _ } from 'lodash';
import jwt from 'jsonwebtoken';

//routes
import routes from './src/routes/imageRoutes.js';
import accountRoutes from './src/routes/accountRoutes.js';

const app = express();
const PORT = 3000;

//mongoose set up
mongoose.connect('mongodb://localhost:27017/imagesDB');

//express use set ups
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//jwt setup
app.use((req, res, next) => {
  //checks if a JWT is provided in the header
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT'
  ) {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          req.user = undefined;
        } else {
          req.user = decoded;
        }
        next();
      }
    );
  }
});

//passing apps to routes function to activate all the routes
routes(app);
accountRoutes(app);

//start server to PORT
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
