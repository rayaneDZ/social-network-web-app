# social_network_app

This is a full-stack social network application using the **MERN** stack (MongoDB, Express, ReactJS, NodeJS)

Technologies used:

- Firebase Storage (to store images)
- MongoDB Atlas (DaaS, to store all other data)
- Json Web Token (for authentication)
- bcrypt (for password hashing)
- axios (for XMLHttp Requests)
- Image-Compressor (to compress images before sending them to Firebase Storage)

### Add a .gitignore file to the server's folder

your **.gitignore** file should look like this:
  ~~~~
  /client/node_modules
  /client/package-lock.json
  /client/.env
  /node_modules
  package-lock.json
  .env
  ~~~~
### Set Envirenment Variables for Back-End

to set environement variables for the server :

1. Install dotenv package
  ~~~~
  npm install dotenv --save
  ~~~~
2. Require dotenv the earliest possible in your server.js
  ~~~~
  require('dotenv').config() 
  ~~~~
3. add a **.env** file in your server's folder
4. git ignore it

your server's **.env** look something like this :
  ~~~~
  JWT_KEY=foo
  SALT_ROUNDS=foo
  MONGODB_USERNAME=foo
  MONGODB_PASSWORD=foo
  ~~~~

Since you gitignored it (for security reasons), The server you will be deploying to, will not be able to read the environement variables because the **.env** file is not sent to that server

in order for the environement variable to work on heroku you have to :

- set them on the heroku website on the setting section and then click on Config Vars

### Set Envirenment Variables for Front-End

to set environement variables for the react app :

1. Install dotenv package
  ~~~~
  npm install dotenv --save
  ~~~~
2. Require dotenv the earliest possible in your index.js just after the imports
  ~~~~
  require('dotenv').config() 
  ~~~~
3. add a **.env** file in your client folder
4. git ignore it

your react's .env look something like this :
  ~~~~
  REACT_APP_JWT_KEY=foo
  REACT_APP_API_KEY=foo
  REACT_APP_AUTH_DOMAIN=foo
  REACT_APP_DATABASE_URL=foo
  REACT_APP_PROJECT_ID=foo
  REACT_APP_STORAGE_BUCKET=foo
  REACT_APP_MESSAGING_SENDER_ID=foo
  REACT_APP_APP_ID=foo
  ~~~~
Since you gitignored it (for security reasons), The server you will be deploying to, will not be able to read the environement variables because the **.env** file is not sent to that server

in order for the environement variable to work on heroku you have to :

- set them on the heroku website on the setting section and then click on Config Vars
- in order for them to be accessed by the client side they **MUST** start with **REACT_APP_**
- so in a nutshell, the front-end can only access environment variables that start with **REACT_APP_**, but the back-end (server) can access all the environment variables, whether they start with **REACT_APP_** or not

### Set up Firebase Storage

In order to have Firebase Storage working, you have to go to https://console.firebase.google.com then :

1. Create a new project
2. Add the credentials of the projects the your react's **.env** file
3. go to your **index.js** file and add this code :
  ~~~~
  import  firebase from 'firebase/app';
  import 'firebase/storage';
  
  const firebaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID
  };
  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  export default storage
  ~~~~
4. Now you will be able to access your Firebase storage in your Component just by importing the storage variable.
For Example : 
  ~~~~
  import storage from '../index.js'
  const uploadTask = storage.ref().child('posts_pictures/' + this.image_uuid).put(image);
  ~~~~# social-network-web-app
