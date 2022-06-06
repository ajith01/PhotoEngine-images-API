import {
  logInUser,
  registerUser,
  isLoggedIn,
} from '../controllers/userAccountController';

const accountRoutes = (app) => {
  app.route('/auth/register').post(registerUser);

  app.route('/auth/login').post(logInUser);
};

export default accountRoutes;
