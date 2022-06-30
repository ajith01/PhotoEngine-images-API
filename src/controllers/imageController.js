import mongoose from 'mongoose';
import { imageSchema } from '../models/imageModel';
import { userSchema } from '../models/userModel';
import { isHttpOrHttps } from '../helperMethods/services';

const Images = mongoose.model('Images', imageSchema);
const User = mongoose.model('user', userSchema);

export const getAllImages = async (req, res) => {
  //TO:DO add ability to get by category
  //TODO: add ability to get the most liked

  try {
    const size = req.body.size ? req.body.size : 50;

    images = await Images.find({});
    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found' });
    }

    if (images.length < size) {
      res.json(images);
    } else {
      //choose $size random images
      res.send(
        images
          .sort(() => {
            return 0.5 - Math.random();
          })
          .slice(size)
      );
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const addImage = async (req, res) => {
  /*creates an image document
   * requires url and category and user
   * size and color are optional
   */
  //TO:DO validate if url is an image

  try {
    const url = req.body.url;
    const category = req.body.category;
    const user = req.user._id; // user is populated by backend
    const size = req.body.size;
    const color = req.body.color;

    if (url === undefined || category === undefined) {
      //check if url and category are given
      return res.status(401).json({
        message: 'Url and category are required',
      });
    }
    //check if url is valid
    const getRequest = isHttpOrHttps(url);
    if (getRequest === -1) {
      return res.status(400).json({
        message: 'Invalid url',
      });
    }
    getRequest(url, async (response) => {
      // both http and express are using port 3000 i think
      if (response.statusCode !== 200) {
        return res.status(400).json({
          message: 'Invalid url',
        });
      }
      //create image Object
      const newImage = await new Images({
        url: url,
        category: category,
        submitedBy: user,
        size: size,
        color: color,
      });

      User.findOneAndUpdate(
        { _id: user._id },
        { $push: { submitedImages: newImage._id } }
      );

      const savedImage = await newImage.save();
      res.status(200).json(savedImage);
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getImageByID = async (req, res) => {
  //get image by id

  try {
    const id = req.params.imageID;
    const foundImage = Images.findById(id);
    if (foundImage) {
      //send image object
      res.status(200).json(foundImage);
      foundImage.calls += 1;
      foundImage.save();
    } else {
      return res.status(404).json({ message: 'Image not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const replaceImageByID = async (req, res) => {
  //replace image by id

  try {
    const id = req.params.imageID;
    const url = req.body.url;
    const category = req.body.category;
    const updateImage = {
      url: url,
      category: category,
      submitedBy: req.user._id,
      size: req.body.size,
      color: req.body.color,
      likes: 0,
      dislikes: 0,
      calls: 0,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    };

    if (url === undefined || category === undefined) {
      //check if url and category are given
      return res.status(401).json({
        message: 'Url and category are required',
      });
    }
    // Find and replace object by id
    const changedImage = await Images.findOneAndReplace(
      { _id: id },
      updateImage,
      { returnDocument: 'after' }
    );

    if (changedImage) {
      res.status(200).json(changedImage);
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const patchImageByID = async (req, res) => {
  //patch image by id
  //TO:DO validate that like and dislikes cannot be changed
  const id = req.params.imageID;

  try {
    if (req.body.likes || req.body.dislikes) {
      throw new Error('Likes and dislikes cannot be changed');
    }
    const updatedImage = await Images.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (updatedImage) {
      return res.status(200).json(updatedImage);
    } else {
      throw new Error('Image unable to be updated');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteImagebyID = async (req, res) => {
  //delete image by id
  try {
    console.log(req.user._id);

    const id = req.params.imageID;
    const result = await Images.findOneAndDelete({ _id: id });
    if (result) {
      res.status(200).json({ message: 'Image deleted', Object: result });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
    const foundUser = await User.findByIdAndRemove(
      { _id: id },
      { $pull: { submitedImages: id } }
    );
    if (!foundUser) {
      console.log('User not updated');
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
