import mongoose from 'mongoose';
import { imageSchema } from '../models/imageModel';
import { collectionsSchema } from '../models/collectionModel';
import { userSchema } from '../models/userModel';

const Images = mongoose.model('Images', imageSchema);
const User = mongoose.model('user', userSchema);
const Collection = mongoose.model('collection', collectionsSchema);

export const getAllCollections = async (req, res) => {
  // Get all the collections for the user
  try {
    const userId = req.user._id;
    const foundUser = await User.findById(userId);
    res.status(200).json(foundUser.collections);
  } catch (err) {
    res.status(500).json({ err });
  }
};

export const makeNewCollection = async (req, res) => {
  // make a new collection and add it to the user object

  try {
    const userId = req.user._id;
    const newCollection = new Collection({
      name: req.params.name,
      description: req.body.description,
      images: [],
    });

    //decide what happens when this is null, null in this is bad
    newCollection.images.push(req.body.imageID);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { collections: newCollection } },
      { returnDocument: 'after' }
    );

    res.status(200).json({ newCollection: newCollection, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getCollectionByName = async (req, res) => {
  // Get a collection by name
  //TODO: Fix the error where it is sending multiple responses back
  try {
    const foundUser = await User.findById(req.user._id);
    foundUser.collections.forEach((element) => {
      if (element.name === req.params.name) {
        return res.status(200).json(element);
      }
    });
    // return res.status(401).json({ message: 'Collection not found' }); //caused by this line running after sending
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateCollectionObject = async (req, res) => {
  //update a collection object
  try {
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId, collections: { $elemMatch: { name: req.params.name } } },
      {
        $set: {
          'collections.$.name': req.body.name,
          'collections.$.description': req.body.description,
        },
      },
      { returnDocument: 'after' }
    );
    res.status(200).json({
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteCollection = async (req, res) => {
  //delete a collection
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { collections: { name: req.params.name } } },
      { returnDocument: 'after' }
    );

    res.status(200).json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const addToCollection = async (req, res) => {
  //adds a image mongoose Object id to a collection
  try {
    //check if the image ID is in the system
    const foundImage = await Images.findById(req.params.imageID);

    if (!foundImage) {
      throw new Error('Image not found');
    }
    //TODO: check if the image ID is in the collection
    //TODO: Find a way to remove the null that was already in the system
    // add image to the collection if it is not already in the collection
    const foundUser = await User.findById({ _id: req.user._id });

    foundUser.collections.forEach((element) => {
      if (element.name === req.params.name) {
        if (element.images.includes(req.params.imageID)) {
          throw new Error('Image already in collection');
        } else {
          element.images.push(foundImage._id);
        }
      }
    });
    const savedUser = await foundUser.save();
    return res.status(200).json({ message: 'Image added to collection' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const removeFromCollection = async (req, res) => {
  // Remove image in the users collection
  try {
    const foundUser = await User.findById({ _id: req.user._id });

    foundUser.collections.forEach((element) => {
      if (element.name === req.params.name) {
        if (element.images.includes(req.params.imageID)) {
          console.log('got here');
          element.images.pull(req.params.imageID);
        } else {
          throw new Error('Image not in collection');
        }
      }
    });
    const savedUser = await foundUser.save();
    return res.status(200).json({ message: 'Image removed from collection' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
