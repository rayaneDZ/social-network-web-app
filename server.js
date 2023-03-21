require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;


//============ROUTES===========//
const signupRoute = require('./routes/signup.js');
const loginRoute = require('./routes/login.js');
const postRoute = require('./routes/post.js');
const userRoute = require('./routes/user.js')
//============ROUTES===========//

//============MIDDLEWARES===========//
app.use(cors());
app.use(bodyParser.json());
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/post', postRoute);
app.use('/api/user', userRoute);
//============MIDDLEWARES===========//

// //========Code For The Heroku Deployement=======//
if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// //========Code For The Heroku Deployement=======//


const start = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000 // 30 seconds
        };
        // await mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
        //     console.log("CONNECTED TO LOCAL DATABASE!")
        //     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        // }).catch((e) => {
        //     console.log("Error: ", e)
        // })

        await mongoose.connect('mongodb+srv://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@cluster0.kziezm0.mongodb.net/socialnetwork?retryWrites=true&w=majority', options).then(() => {
            console.log("CONNECTED TO ATLAS DATABASE!")
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }).catch((e) => {
            console.log("Error: ", e)
        })

    } catch (e) {
        console.log("### SERVER ERROR ###")
        console.log(e)
    }
}

start();
