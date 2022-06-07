import { isLoggedIn } from '../controllers/userAccountController';
import { addImage, getAllImages } from '../controllers/imageController';
const routes = (app) => {
  app
    .route('/images')

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
    .route('/img/:imageID')

    .put((req, res) => {
      res.send('Put request successful');
    })

    .patch((req, res) => {
      res.send('Patch request successful');
    })

    .delete((req, res) => {
      res.send('Delete request successful');
    });
};

export default routes;
