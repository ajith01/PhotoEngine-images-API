import { isLoggedIn } from '../controllers/userAccountController';
import {
  addImage,
  getAllImages,
  getImageByID,
  replaceImageByID,
  patchImageByID,
  deleteImagebyID,
} from '../controllers/imageController';
const routes = (app) => {
  app
    .route('/image')

    .get(
      // gets a random image
      (req, res, next) => {
        //TODO: Middleware here
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request from: ${req.method}$`);
        console.log(`Request from: ${req.method}$`);
        next(); //make call to next function
      },
      getAllImages
    )

    .post(isLoggedIn, addImage);

  app
    .route('/image/:imageID')
    .get(getImageByID)

    .put(isLoggedIn, replaceImageByID)

    .patch(isLoggedIn, patchImageByID)

    .delete(isLoggedIn, deleteImagebyID);
};

export default routes;
