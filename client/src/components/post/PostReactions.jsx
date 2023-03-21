import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/postreactions.css';

const style ={
    reacts_container : {
        display : 'flex',
        marginBottom : 0
    },
    react_button : {
        borderStyle : 'none',
        width: '100%',
        display : 'flex',
        justifyContent : 'center'
    },
    inputField :{
      marginBottom : 14.5
    },
    commentInput : {
      margin : 0,
      marginRight : 10,
      padding: 5,
      height : 25,
      borderStyle : 'none',
      border : '1px solid black',
      borderRadius : '5px',
      width : 'calc(100% - 20px)'
    },
    btnColor : {
      backgroundColor : '#673ab7',
      color : 'white',
  }
}

function PostReactions (props) {

  const [comment, setComment] = useState(false);
  const [likeNumber, setLikeNumber] = useState(props.reacts.like.number);
  const [dislikeNumber, setDislikeNumber] = useState(props.reacts.dislike.number);
  const [likedByUser, setLikedByUser] = useState(false);
  const [dislikedByUser, setDislikedByUser] = useState(false);
  
  useEffect(() => {
    if(props.reacts.like.liked_by.includes(localStorage.getItem('username'))) {
      setLikedByUser(true)
    } else if(props.reacts.dislike.disliked_by.includes(localStorage.getItem('username'))) {
      setDislikedByUser(true)
    }
  }, []);
  
  // if(props.reacts.like.liked_by.includes(localStorage.getItem('username')))
  //   setLikedByUser(true)
  // if(props.reacts.dislike.disliked_by.includes(localStorage.getItem('username')))
  //   setDislikedByUser(true)
  
  const toggleComment = () =>{
    setComment(!comment)
  }
  const likePost = () => {
    console.log("liking the post")
    const data = {
      'postID' : props.postID,
      'user' : localStorage.getItem('username')
    }
    axios({
      method : 'post',
      url : '/api/post/like',
      data : data,
      headers : {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      const code = response.data.code
      if( code === 0){
        setLikeNumber(likeNumber + 1)
        setLikedByUser(true)
      }else if(code === 1){
        setLikeNumber(likeNumber - 1)
        setLikedByUser(false)
      }else if (code === 2){
        setLikeNumber(likeNumber + 1)
        setLikedByUser(true)
        setDislikeNumber(dislikeNumber - 1)
        setDislikedByUser(false)
      }
    }).catch(err => {
      if(err.response.data.message === "Auth failed"){
        alert('you need to LOG IN')
      }
    })
  }
  const dislikePost = () => {
    const data = {
      'postID' : props.postID,
      'user' : localStorage.getItem('username')
    }
    axios({
      method : 'post',
      url : '/api/post/dislike',
      data : data,
      headers : {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      const code = response.data.code
      if( code === 0){
        setDislikeNumber(dislikeNumber + 1)
        setDislikedByUser(true)
      }else if(code === 1){
        setDislikeNumber(dislikeNumber - 1)
        setLikedByUser(false)
      }else if (code === 2){
        setDislikeNumber(dislikeNumber + 1)
        setDislikedByUser(true)
        setLikeNumber(likeNumber - 1)
        setLikedByUser(false)
      }
    }).catch(err => {
      if(err.response.data.message === "Auth failed"){
        alert('you need to LOG IN')
      }
    })
  }
  const addCommentToPost = () => {
    const user = localStorage.getItem('username');
    const content = document.getElementById('commentContent').value;
    const data = {
      'user' : user,
      'content' : content,
      'postID' : props.postID
    }
    axios({
      method : 'post',
      url : '/api/post/comment',
      data : data,
      headers : {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      setComment(!comment)
      props.addCommentToPost(user, content, res.data.ObjectID);
    }).catch(err => {
      if(err.response.data.message === "Auth failed"){
        alert('you need to LOG IN')
      }
    })
  }
  return (
    <>
      <div style = {style.reacts_container}>
        <button className={"btn-flat waves-effect waves-light" + (likedByUser ? " changeColor" : "")} style={style.react_button} onClick={likePost}><i className="far fa-thumbs-up" style={{marginRight : 10}}></i>{likeNumber}</button>
        <button className={"btn-flat waves-effect waves-light" + (dislikedByUser ? " changeColor" : "")} style={style.react_button} onClick={dislikePost}><i className="far fa-thumbs-down" style={{marginRight : 10}}></i>{dislikeNumber}</button>
        <button className="btn-flat waves-effect waves-light" style={style.react_button} onClick={toggleComment}><i className="far fa-comment-alt" style={{marginRight : 10}}></i>{props.numberOfComments}</button>
      </div>
      {
        comment ? 

          <div style={{display : 'flex', alignItems: 'center', marginTop : 10}} id="commentInput">
            <input type="text" placeholder="comment" style={style.commentInput} id="commentContent"/>
            <button className="btn-flat" style = {style.btnColor} onClick={addCommentToPost}>Comment</button>
          </div>
          
        : 
          <div></div>
      }
      
    </>
  )
}

export default PostReactions
