import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import ProfileHeader from './ProfileHeader';
import Post from '../post/Post';
import axios from 'axios';
import moment from 'moment';
import Loading from '../Loading';
import UserNotFound from '../UserNotFound'
import Footer from '../Footer';
import '../css/profile.css';

const style = {
    container : {
        marginTop : 20,
        marginRight : 'auto',
        marginLeft : 'auto',
        maxWidth: 700
    },
    profileContainer : {
      height : '100%',
      backgroundColor : '#e9ebee'
    },
    noPosts : {
      margin : '50px auto',
      width : 200,
      textAlign : 'center'
    }
}

function postsMapper(posts, deletePostFunction){
  return posts.map(post =><Post
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
  />)
}

function Profile() {
  
  // TODO : cannot access profile of another user
  const pathArray = window.location.pathname.split('/');
  const lastPath = pathArray[pathArray.length - 1]; // get the last element of the array
  console.log(lastPath);
  let username = lastPath;

  const [loading, setLoading] = useState(true)
  const [noPosts, setNoPosts] = useState(false)
  const [postsArray, setPostsArray] = useState([])
  const [user, setUser] = useState({})
  const [userFound, setUserFound] = useState(true)

  useEffect(() => {
    const asyncawaitGetRequest = async () => {
      let response  = await axios.get(`/api/user/${username}`);
      if (response.data.result){
        setUser(response.data.result)
      }else {
        console.log('user not found')
        setLoading(false)
        setUserFound(false)
      }
    }
    asyncawaitGetRequest();
  }, [])
  
  useEffect(() => {
    getUserPosts();
  }, [])

  const getUserPosts = () =>{
    axios.get(`/api/post/${username}`)
    .then(result => {
      if(result.data.length <= 0){
        setNoPosts(true)
        setLoading(false)
      }
      return result.data.posts;
    }).then(posts => {
      const mappedPosts = postsMapper(posts, deletePost)
      setPostsArray(mappedPosts)
      setLoading(false)
    })
  }
  const deletePost = (postId) => {
    setPostsArray(postsArray.filter(post => post.key !== postId))
  }
  return (
    <div style= {style.profileContainer}>
        <NavBar />
        {
          loading ? 
            <Loading/> 
          : userFound ?
              <>
                <div className="container" style = {style.container}>
                  <ProfileHeader user = {user}/>
                </div>
                <div className=" container " style = {style.container} id="profilePostsContainer">
                  {
                    noPosts ?
                      <div style={style.noPosts}><h5>No Posts Yet</h5></div>
                    :
                      <div>{postsArray}</div>
                  }
                </div>
              </>
            :
              <UserNotFound/>
        }
        <Footer/>
    </div>
  )
}

export default Profile
