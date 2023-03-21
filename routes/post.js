const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const check_auth = require('../middlewares/check_auth.js');
const router = express.Router();


//POST A POST
router.post('/', check_auth, (req, res) => {
    User.find({username : req.body.username})
    .exec()
    .then(user => {
        console.log('post request from this the user : ', user[0].username)
        //IF USER IS NULL
        if(user.length === 0){
            console.log('user not found')
            return res.status(404).json({
                message: 'user not found'
            });
        }
        //CREATE A POST WITH THE USER POPULATED-IN AND SAVE IT
        //postID is created externally because I need it when adding an entry to owners posts so I don't have to make another query just to get the post id
        let postId = new mongoose.Types.ObjectId();
        const post = new Post({
            _id: postId,
            content: req.body.content,
            user: user[0].username,
            profile_picture_path : user[0].profile_picture_path,
            image_path : req.body.image_path,
            image_uuid : req.body.image_uuid
        });
        post.save()
        .then(() => {
            //ADD AN ENTRY IN THE OWNERS POSTS ARRAY
            User.updateOne({username : req.body.username}, {$push : {posts : postId}})
            .exec()
            .then(result => {
                console.log(result);
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }).catch(err => {
            res.status(500).json({
                message : err
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message : err
        });
    });
});

//DELETE A POST
router.post('/delete', check_auth, (req, res) => {
    //REMOVE THE POST
    const postId = req.body.postId;
    const user = req.body.user;
    Post.deleteOne({_id : postId})
    .exec()
    .then(()=>{
        User.findOne({username : user})
        .exec()
        .then(returnedUser => {
            const index = returnedUser.posts.indexOf(postId);
            if(index > -1){
                returnedUser.posts.splice(index, 1);
                returnedUser.save();
                res.status(202).json({
                    message: 'entry point deleted'
                });
            }else{
                res.status(404).json({
                    message: 'post not found'
                })
            }
        })
    })
})
//GET ALL POSTS
router.get('/', (req, res) => {
    console.log('GETTING THE POSTS')
    Post.find().sort({'reacts.like.number' : 1})
    .exec()
    .then(posts => {
        res.status(200).json({
            length: posts.length,
            posts: posts
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err
        });
    });
});

//GET A SPECIFIC USER POSTS
router.get('/:user', (req, res) => {
    Post.find({user : req.params.user})
    .exec()
    .then(posts => {
        res.status(200).json({
            length: posts.length,
            posts: posts
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err
        });
    });
});
//LIKE A POST
router.post('/like', check_auth, (req, res) => {
    
    const user = req.body.user;
    const postID = req.body.postID;

    Post.find({_id : postID})
    .exec()
    .then(post => {
        if(post[0].reacts.like.liked_by.includes(user)){
            Post.updateOne({_id: postID}, { $inc : { 'reacts.like.number' : -1}, $pull: { 'reacts.like.liked_by': user }})
            .exec()
            .then( () => {
                console.log('post unliked successfully');
                return res.status(200).json({
                    message : 'post unliked successfully',
                    code : 1
                })
            })
        }else{
            if(post[0].reacts.dislike.disliked_by.includes(user)){
                Post.updateOne({_id: postID}, { $inc : { 'reacts.dislike.number' : -1}, $pull: { 'reacts.dislike.disliked_by': user }})
                .exec()
                Post.updateOne({_id: postID}, { $inc : { 'reacts.like.number' : 1}, $push: { 'reacts.like.liked_by': user }})
                .exec()
                .then( () => {
                    return res.status(200).json({
                        message : 'post liked successfully and undisliked',
                        code : 2
                    })
                })
            }else{
                Post.updateOne({_id: postID}, { $inc : { 'reacts.like.number' : 1}, $push: { 'reacts.like.liked_by': user }})
                .exec()
                .then( () => {
                    return res.status(200).json({
                        message : 'post liked successfully',
                        code : 0
                    })
                })
            }
        }
    })
});

//DISLIKE A POST
router.post('/dislike', check_auth, (req, res) => {

    const user = req.body.user;
    const postID = req.body.postID;

    Post.find({_id : postID})
    .exec()
    .then(post => {
        //IF IT IS DISLIKED THEN REMOVE DISLIKE
        if(post[0].reacts.dislike.disliked_by.includes(user)){
            Post.updateOne({_id: postID}, { $inc : { 'reacts.dislike.number' : -1}, $pull: { 'reacts.dislike.disliked_by': user }})
            .exec()
            .then( () => {
                return res.status(200).json({
                    message : 'post undisliked successfully',
                    code : 1
                })
            })
        }else{
            //IF IT NOT DISLIKED THEN CHECK IF IT IS LIKED AND REMOVE THE LIKE AND RESUME
            if(post[0].reacts.like.liked_by.includes(user)){
                Post.updateOne({_id: postID}, { $inc : { 'reacts.like.number' : -1}, $pull: { 'reacts.like.liked_by': user }})
                .exec()
                Post.updateOne({_id: postID}, { $inc : { 'reacts.dislike.number' : 1}, $push: { 'reacts.dislike.disliked_by': user }})
                .exec()
                .then( () => {
                    return res.status(200).json({
                        message : 'post disliked successfully and unliked',
                        code : 2
                    })
                })
            }else {
                Post.updateOne({_id: postID}, { $inc : { 'reacts.dislike.number' : 1}, $push: { 'reacts.dislike.disliked_by': user }})
                .exec()
                .then( () => {
                    return res.status(200).json({
                        message : 'post disliked successfully',
                        code : 0
                    })
                })
            }
        }
    })
});

//COMMENT ON A POST
router.post('/comment', check_auth, (req, res) => {
    const user = req.body.user;
    const content = req.body.content;
    const postID = req.body.postID;
    const commentID = new mongoose.Types.ObjectId();
    console.log(user + 'commented : ' + content + '\n on post : ' + postID);

    Post.updateOne({_id: postID}, {$inc : {'reacts.comment.number' : 1}, $push : {'reacts.comment.content' : {user : user, content : content, commentID : commentID}} })
    .exec()
    .then(()=>{
        console.log('commented successfully')
        return res.status(201).json({
            message : 'comment created',
            ObjectID : commentID
        })
    }).catch(err => {
        console.log(err);
    })
})

//DELETE COMMENT ON A POST
router.post('/deleteComment', check_auth, (req, res) => {
    const postID = req.body.postID;
    const commentID = req.body.commentID;
    console.log(postID, commentID)
    Post.findById({_id : postID})
    .exec()
    .then(result => {
        console.log('found it')
        let comments = result.reacts.comment.content;
        comments.forEach(comment => {
            if(comment.commentID == commentID){
                console.log('found the comment')
                comments.splice(comments.indexOf(comment), 1);
                result.reacts.comment.number -= 1;
                result.save();
                res.status(201).json({
                    message : 'comment deleted',
                    commenID : commentID
                })
            }
        })
    })
})
module.exports = router;