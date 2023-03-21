import React, { useState } from 'react';
import '../css/postcontent.css'

const style = {
    content : {
        paddingLeft : 0,
        marginBottom : 15
    }
}

function PostContent(props){
  
  const [enlarged, setEnlarged] = useState(false);

  const enlarge = (e) =>{
    if(!enlarged)
      e.target.parentNode.style.maxHeight = "fit-content";
    else
      e.target.parentNode.style.maxHeight = "500px";
    setEnlarged(true)
  }
  return (
      <div className="content" style ={style.content} id="postContent">
          <p>{props.content}</p>
          {
            props.image_path.length > 0 ?
            <div className="post_image_container" onClick={enlarge}>
              <img src ={props.image_path} alt="media for the post" style={{width : '100%'}}/>
            </div>
            :
              <></>
          }
      </div>
  )
}

export default PostContent;