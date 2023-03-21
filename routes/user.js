const express = require('express');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const check_auth = require('../middlewares/check_auth.js');
const router = express.Router();

//GET USER PROFILE
router.get('/:username', (req, res) =>{
    User.findOne({username : req.params.username})
    .exec()
    .then(result => {
        if(result){
            return res.status(200).json({
                result : result
            })
        }else{
            return res.status(200).json({
                result : null
            })
        }
    })
})

//UPDATE USER PROFILE PICTURE
router.post('/updateProfilePicture', check_auth, (req, res) => {
    User.findOneAndUpdate({username : req.body.username}, {profile_picture_path : req.body.ppp, pp_uuid : req.body.pp_uuid})
    .exec()
    .then(result => {
        Post.find({user: req.body.username})
        .exec()
        .then(postsArr => {
            postsArr.forEach(post => {
                post.profile_picture_path = req.body.ppp
                post.pp_uuid = req.body.pp_uuid
                post.save()
            })
            return res.status(201).json({
                result : result
            })
        })
    }).catch(err => {
        return res.status(500).json({
            err: err
        })
    })
})

router.get('/search/:match', (req, res) =>{
    var matchRegEx = new RegExp('^' + req.params.match, 'i');
    console.log(matchRegEx, req.params.match);
    User.find({username: matchRegEx})
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})
module.exports = router;
