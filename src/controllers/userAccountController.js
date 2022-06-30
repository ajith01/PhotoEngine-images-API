import mongoose from 'mongoose';
import { userSchema } from '../models/userModel';

//security modules
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

export const registerUser = async (req, res) => {
  //register user account

  //TODO: add validation for password and username
  //check if a password is provided
  //check if username is provided
  //check if username is already taken
  //check if password is strong enough

  try {
    const user = await new User({ username: req.body.username }); //create new user object
    //requires that we use salt etc,fix this error
    const hash = await bcrypt.hash(req.body.password, 10); //hash password
    user.hashedPassword = hash;
    const savedUser = await user.save(); //save user to database

    //return userback without the hashed password
    savedUser.hashedPassword = undefined;
    res.status(201).json(savedUser);

    //change password field with hash
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const logInUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!user) {
      // no user found
      return res.status(401).json({ message: 'User not found' });
    }
    //change this into callback
    const result = bcrypt.compare(req.body.password, user.hashedPassword);
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
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

//TO:DO implement a log out function that will
//remove the token from the user's account or block from server
