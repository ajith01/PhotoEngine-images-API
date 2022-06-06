# PhotoEngine-images-API
A REST API that allows users to submit links of images with falling into various categories, which can be later queried by other users to use as placeholder images. The users can perform basic CRUD operations on the databases using the API.  A user must sign up to post and update their images, but the images can be used without signing up. 

This API is written in NodeJS using express library to make the web application to handle the HTTP requests. MongoDB is used as the database to store the links to the images and user information. 

The API is secured using bcrypt for passwords and jsonwebtokens (JWT) is used to presist login sessions rather than cookies.

## Requirements
Install Node.js: https://nodejs.org.
> 💡 This repository was written in node version 16.15.0. Make sure the version is appropriate using `node --version` 

## Getting Started
```bash
# clone repository and go into the folder
git clone https://github.com/ajith01/PhotoEngine-images-API.git
cd PhotoEngine-images-API

# install required modules 
npm i

# run code 
node server.js

```
## API Docs


> 💡 This repository was written in node version 16.15.0. Make sure the version is appropriate using `node --version` 



| HTTP verbs  | /images | /images/:imageid  | 
| ------------- | ------------- |
| GET  | (Optional Arugement: ?number=50) Returns 50 (by default) randomly selected images | Returns the image with the image ID|
| POST  | (Arguement: ?category='Cars' , requires login ) Adds an url of an image to the database   | - |
| PUT  |  -  | ( requires login ) Replace the image document with a new Object|
| PATCH  | - | ( requires login ) Replace or adds a feild to the image document |
| DELETE  | - | ( requires login ) Deletes the entire image document|

