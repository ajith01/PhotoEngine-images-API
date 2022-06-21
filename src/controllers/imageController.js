import mongoose from 'mongoose';
import { imageSchema } from '../models/imageModel';
import { userSchema } from '../models/userModel';
import { isHttpOrHttps } from '../helperMethods/services';

const Images = mongoose.model('Images', imageSchema);
const User = mongoose.model('user', userSchema);

export const getAllImages = (req, res) => {
  //TO:DO add ability to get by category
  //TODO: add ability to get the most liked
  const size = req.body.size ? req.body.size : 50;

  Images.find({}, (err, images) => {
    if (err) {
      res.json(err);
    } else {
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
    }
  });
};

export const addImage = async (req, res) => {
  /*creates an image document
   * requires url and category and user
   * size and color are optional
   */
  //TO:DO validate if url is an image

  const url = req.body.url;
  const category = req.body.category;
  const user = req.user._id; // user is populated by backend
  const size = req.body.size;
  const color = req.body.color;

  if (url === undefined || category === undefined) {
    //check if url and category are given
    res.status(401).json({
      message: 'Url and category are required',
    });
  } else {
    //check if url is valid
    const getRequest = await isHttpOrHttps(url);
    if (getRequest === -1) {
      res.status(400).json({
        message: 'Invalid url',
      });
    } else {
      getRequest(url, (response) => {
        // both http and express are using port 3000 i think
        if (response.statusCode !== 200) {
          response.status(400).json({
            message: 'Invalid url',
          });
        } else {
          //create image Object
          const newImage = new Images({
            url: url,
            category: category,
            submitedBy: user,
            size: size,
            color: color,
          });

          User.findOneAndUpdate(
            { _id: user._id },
            { $push: { submitedImages: newImage._id } },
            (err) => {
              if (err) {
                res.status(500).json({
                  message: 'Error saving to account',
                });
              }
            }
          );

          newImage.save((err, image) => {
            if (err) {
              res.status(500).json({
                message: 'Error saving image',
              });
            } else {
              res.status(200).json(image);
            }
          });
        }
      });
    }
  }
};

export const getImageByID = (req, res) => {
  //get image by id
  const id = req.params.imageID;
  Images.findById(id, (err, foundImage) => {
    if (err) {
      res.status(500).json({
        message: 'Error finding image',
      });
    } else {
      if (foundImage) {
        //send image object
        res.status(200).json(foundImage);
        foundImage.calls += 1;
        foundImage.save();
      } else {
        res.status(404).json({ message: 'Image not found' });
      }
    }
  });
};

export const replaceImageByID = (req, res) => {
  //replace image by id
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
    res.status(401).json({
      message: 'Url and category are required',
    });
  } else {
    // Find and replace object by id
    Images.findOneAndReplace(
      { _id: id },
      updateImage,
      { returnDocument: 'after' },
      (err, changedImage) => {
        if (err) {
          res.status(500).json({
            message: 'Error replacing image',
          });
        } else {
          if (changedImage) {
            console.log(changedImage);
            res.status(200).json(changedImage);
          }
        }
      }
    );
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
      res.status(200).json(updatedImage);
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
    res.status(500).send(error);
  }
};
