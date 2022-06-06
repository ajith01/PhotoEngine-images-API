import mongoose from 'mongoose';
import { imageSchema } from '../models/imageModel';
import { collectionsSchema } from '../models/collectionModel';
import { userSchema } from '../models/userModel';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = mongoose.model('user', userSchema);

export const isLoggedIn = (req, res, next) => {
  /* used as a middleware to check if user is logged in 
  for tasks that require that user is logged in
  */
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Account required for this operation' });
  }
};

export const registerUser = (req, res) => {
  //register user account

  //TODO: add validation for password and username
  //check if a password is provided
  //check if username is provided
  //check if username is already taken
  //check if password is strong enough

  const user = new User({ username: req.body.username }); //create new user object
  //requires that we use salt etc,fix this error
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(400).json({ message: 'Error Hashing Password' });
    } else {
      user.hashedPassword = hash;
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({ message: 'Error creating user' });
        } else {
          //return userback without the hashed password
          user.hashedPassword = undefined;
          res.status(201).json(user);
        }
      });
    }
  }); //change password field with hash
};

export const logInUser = (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json({ message: 'Error logging in' });
    }
    if (!user) {
      // no user found
      res.status(401).json({ message: 'User not found' });
    } else if (user) {
      //if a user is found, compare the password
      //change this into callback
      bcrypt.compare(req.body.password, user.hashedPassword, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Authentication failed' });
        } else {
          if (result) {
            //if the password is correct, create a token
            return res.json({
              token: jwt.sign(
                { username: user.username, _id: user.id },
                process.env.JWT_SECRET,
                {
                  expiresIn: '24h',
                }
              ),
            });
          } else {
            return res.status(401).json({ message: 'Authentication failed' });
          }
        }
      });
    }
  });
};

//TO:DO implement a log out function that will
//remove the token from the user's account or block from server
