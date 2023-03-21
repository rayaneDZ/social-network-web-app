import React, { useState, useEffect } from 'react';
import Post from '../post/Post.jsx';
import MakePost from '../MakePost.jsx'
import Loading from '../Loading.jsx';
import axios from 'axios';
import moment from 'moment';

const style = {
    container : {
        marginTop : 20,
        marginRight : 'auto',
        marginLeft : 'auto',
        maxWidth: 700
    }
}

function postsMapper(posts, deletePostFunction){
  return posts.map(post => <Post
    deletePost = {deletePostFunction}
    key = {post._id}
    postID = {post._id}
    user = {post.user}
    PPP = {post.profile_picture_path}
    date = {moment(post.date).format('DD-MM-YYYY')}
    image_path = {post.image_path}
    image_uuid = {post.image_uuid}
    content = {post.content}
    reacts = {post.reacts}
  />);
}

function Content (){
  
  const [loading, setLoading] = useState(true);
  const [postsArray, setPostsArray] = useState([]);

  useEffect(() => {
    axios.get('/api/post').then(result => {
      console.log("getting the posts from the Content.jsx file")
      setLoading(false)
      return result.data.posts;
    }).then(posts => {
        //for each post that we got
        const mappedPosts = postsMapper(posts, deletePost)
        setPostsArray(mappedPosts)
      });
  }, []);

  const deletePost = (postId) => {
    setPostsArray(postsArray.filter(post => post.key !== postId))
  }

  const addPost = (post) => {
    //populate a new post with the post we got from MakePost component
    const newPost = <Post
      deletePost = {deletePost}
      key = {post._id}
      postID = {post._id}
      user = {post.user}
      PPP = {post.profile_picture_path}
      date = {moment(post.date).format('DD-MM-YYYY')}
      image_path = {post.image_path}
      image_uuid = {post.image_uuid}
      content = {post.content}
      reacts = {post.reacts}
    />
    setPostsArray([newPost, ...postsArray])
  }
  
  return (
    <div className="container" style = {style.container} id="postsContainer">
      <MakePost addPost = {addPost}/>
      {
      loading ?
        <Loading/>
      : 
        <div>{postsArray}</div>
      }
    </div>
  )
}

export default Content
