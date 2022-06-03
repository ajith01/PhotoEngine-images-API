const routes = (app) => {
  app
    .route('/img')

    .get(
      (req, res, next) => {
        //TODO: Middleware here
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request from: ${req.method}$`);
        console.log(`Request from: ${req.method}$`);
        next(); //make call to next function
      },
      (req, res, next) => {
        //next function
        res.send('Get request successful');
      }
    )

    .post((req, res) => {
      res.send('Post request Sucessful');
    });

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
