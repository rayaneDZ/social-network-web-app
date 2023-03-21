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

```
/client/node_modules
/client/package-lock.json
/client/.env
/node_modules
package-lock.json
.env
```

### Set Envirenment Variables for Back-End

to set environement variables for the server :

1. Install dotenv package

```
npm install dotenv --save
```

2. Require dotenv the earliest possible in your server.js

```
require('dotenv').config()
```

3. add a **.env** file in your server's folder
4. git ignore it

your server's **.env** look something like this :

```
JWT_KEY=foo
SALT_ROUNDS=foo
MONGODB_USERNAME=foo
MONGODB_PASSWORD=foo
```

Since you gitignored it (for security reasons), The server you will be deploying to, will not be able to read the environement variables because the **.env** file is not sent to that server

in order for the environement variable to work on heroku you have to :

- set them on the heroku website on the setting section and then click on Config Vars

### Set Envirenment Variables for Front-End

to set environement variables for the react app :

1. Install dotenv package

```
npm install dotenv --save
```

2. Require dotenv the earliest possible in your index.js just after the imports

```
require('dotenv').config()
```

3. add a **.env** file in your client folder
4. git ignore it

your react's .env look something like this :

```
VITE_REACT_APP_JWT_KEY=foo
VITE_REACT_APP_API_KEY=foo
VITE_REACT_APP_AUTH_DOMAIN=foo
VITE_REACT_APP_DATABASE_URL=foo
VITE_REACT_APP_PROJECT_ID=foo
VITE_REACT_APP_STORAGE_BUCKET=foo
VITE_REACT_APP_MESSAGING_SENDER_ID=foo
VITE_REACT_APP_APP_ID=foo
```

Since you gitignored it (for security reasons), The server you will be deploying to, will not be able to read the environement variables because the **.env** file is not sent to that server

in order for the environement variable to work on heroku you have to :

- set them on the heroku website on the setting section and then click on Config Vars
- in order for them to be accessed by the client side they **MUST** start with **VITE_REACT_APP\***
- so in a nutshell, the front-end can only access environment variables that start with **VITE_REACT_APP\***, but the back-end (server) can access all the environment variables, whether they start with **VITE_REACT_APP\*** or not

### Set up Firebase Storage

In order to have Firebase Storage working, you have to go to https://console.firebase.google.com then :

1. Create a new project
2. Add the credentials of the projects the your react's **.env** file
3. go to your **index.js** file and add this code :

```
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_REACT_APP_DATABASE_URL,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage
```
