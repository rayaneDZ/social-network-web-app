import React, { useState, useEffect } from "react";
import PostHeading from './PostHeading.jsx';
import PostContent from './PostContent.jsx';
import PostReactions from './PostReactions.jsx';
import PostComments from './PostComments.jsx';
import ShowComments from './ShowComments.jsx';
import '../css/post.css'

function commentMapper(props, comments, deleteCommentFromPostFunction){
  return comments.map(comment => <PostComments
    user = {comment.user}// returns user0
    content = {comment.content}// returns content0
    key = {comment.commentID} //returns commentID0
    id = {comment.commentID}
    postID = {props.postID}
    deleteCommentFromPost = {deleteCommentFromPostFunction} 
  />)
}

function Post(props) {
  const [comments, setComments] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(props.reacts.comment.number);
  const [commentsComponentsArray, setCommentsComponentsArray] = useState([]);

  useEffect(() => {
    // now parsedComments = [{user : user0, content : content0, commentID : commentID0}, {user : user1, content : content1, commentID : commentID1}]
    const parsedComments = props.reacts.comment.content;
  
    const mappedComments = commentMapper(props, parsedComments, deleteCommentFromPost)
    //set the state so that I can update post whenever I submit a comment
    setCommentsComponentsArray(mappedComments)
  }, []);

  const toggleComments = () => {
    setComments(!comments)
  }

  const addCommentToPost = (user, content, commentID) => {
    const newComment = <PostComments
    user = {user}
    content = {content}
    key = {commentID}
    id = {commentID}
    postID = {props.postID} 
    deleteCommentFromPost = {deleteCommentFromPost} />

    setCommentsComponentsArray([newComment, ...commentsComponentsArray])
    setNumberOfComments(numberOfComments + 1)
  }
  const deleteCommentFromPost = (commentID) => {
    //this function is passed as a prop to PostComments
    //It is  invoked when you click the submit comment button
    //in order to show the comment without hitting the database
    setCommentsComponentsArray(commentsComponentsArray.filter(comment => comment.key !== commentID))
    setNumberOfComments(numberOfComments - 1)
    document.getElementById(commentID).style.display = 'none';
  }
  return (
      <div className = "card" id="postContainer">
          <PostHeading user = {props.user} date = {props.date} PPP = {props.PPP} postID = {props.postID} deletePost = {props.deletePost} image_uuid = {props.image_uuid}/>
          <PostContent content = {props.content} image_path = {props.image_path}/>
          {numberOfComments > 0 ? <ShowComments handler = {toggleComments}/> : <div></div>}
          <PostReactions postID = {props.postID} reacts = {props.reacts} addCommentToPost = {addCommentToPost} numberOfComments = {numberOfComments} toggleComments = {toggleComments}/>
          {
            comments ?
              <React.Fragment>
                {commentsComponentsArray}
              </React.Fragment>
            :
              <React.Fragment></React.Fragment>
          }
      </div>
  )
}

export default Post