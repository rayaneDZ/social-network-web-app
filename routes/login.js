const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
    User.find({ username: req.body.username })
        .then(user => {
            if (user.length < 1) {
                console.log('user not found')
                return res.status(401).json({
                    message: 'wrong'
                });
            }
            bcrypt.compare(req.body.password, user[0].hashed_password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        user_id: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1d'
                        }
                    );
                    console.log('auth successful')
                    return res.status(200).json({
                        message: 'success',
                        token: token,
                        username: user[0].username,
                        profile_picture_path: user[0].profile_picture_path
                    })
                }
                return res.status(401).json({
                    message: 'wrong'
                });
            })
        })
});

module.exports = router;