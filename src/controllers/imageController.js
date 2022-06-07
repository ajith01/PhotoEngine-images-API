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
      res.send(err);
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
  const user = req.user; // user is populated by backend
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

export const getImageByID = (req, res) => {};

export const replaceImageByID = (req, res) => {};

export const patchImageByID = (req, res) => {};

export const deleteImagebyID = (req, res) => {};
