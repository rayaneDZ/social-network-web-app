import axios from 'axios';
import ImageCompressor from 'image-compressor.js';
import { v4 as uuidv4 } from 'uuid';
import storage from '../main.jsx';
import './css/makepost.css';

const style = {
  btnColor : {
      backgroundColor : '#673ab7',
      color : 'white'
  }
}

function MakePost(props) {

  let imagePlaceholder;
  let progressBar;
  let fileInputPlaceholder;
  
  const handleFile = (e) => {
    const image = e.target.files[0]
    //const _this = this
    const compressDownTo = 500000
    if(image.size > compressDownTo){
      const quality = 1/(image.size/compressDownTo);
      new ImageCompressor(image, {
        quality: quality,
        success(compressedImage) {
          imagePlaceholder = compressedImage
          previewFile(compressedImage)
        },
        error(e) {
          console.log(e.message);
        },
      });
    }else{
      imagePlaceholder = image
      previewFile(image)
    }
  }
  const previewFile = (image) => {
    var reader  = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", function () {
        const src = reader.result;
        document.getElementById('makePostImageContainer').innerHTML = `<img src="${src}" height="100" alt="Image preview..." id="imagePreview"/>`
    }, false);
  }
  const handlePost = () => {
    document.getElementById('postButton').classList.add('disabled')
    const username = localStorage.getItem('username');
    const content = document.getElementById('textareaContent').value;
    const image = imagePlaceholder
    if(content.length > 0 && imagePlaceholder){
      uploadToFirebase(image, content)
    }else if (content.length > 0 && !imagePlaceholder){
      postRequestToBackend(username, content);
    }else if (content.length <= 0 && imagePlaceholder){
      //make upload to firebase a separate function
      uploadToFirebase(image)
    }
  }
  const uploadToFirebase = (image, content) => {
    progressBar = document.getElementById('makePostProgressBar');
    progressBar.style.display = 'block'
    imagePlaceholder_uuid = uuidv4()
    const username = localStorage.getItem('username');
    const uploadTask = storage.ref().child('posts_pictures/' + imagePlaceholder_uuid).put(image);
    uploadTask.on("state_changed", (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      document.getElementById('determinate').style.width = progress + '%'
    }, () =>{
      console.log('error occured in uploadtaks to firebase')
    }, () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        postRequestToBackend(username, content, downloadURL, imagePlaceholder_uuid);
      });
    });
  }
  const postRequestToBackend = (username, content, image_path, image_uuid) => {
    const data = {
      'content' : content,
      'username' : username,
      'image_path' : image_path,
      'image_uuid' : image_uuid
    }
    axios({
      method: 'post',
      url : '/api/post',
      data : data,
      headers : {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      document.getElementById('textareaContent').value = "";
      document.getElementById('postButton').classList.remove('disabled')
      if(document.getElementById('imagePreview')){
        document.getElementById('imagePreview').style.display = 'none';
        progressBar.style.display = 'none';
      }
      imagePlaceholder = null
      //pass the response to Content component in order to populate a new post
      props.addPost(response.data)
    }).catch(err => {
      if(err.response.data.message === "Auth failed"){
        alert('you need to LOG IN')
      }
    })
  }

  return (
    <div className="card">
      <div id="makepostcontainer">
        <textarea placeholder="what's on your mind" id="textareaContent"></textarea>
        <div id="makePostImageContainer"></div>
        <div style={{display : 'flex', alignItems : 'center'}}>
          <button className="btn-flat" style = {style.btnColor} onClick={handlePost} id="postButton">Post</button>
          <input type="file" onChange={handleFile} style={{display :'none'}} ref={fileInput => fileInputPlaceholder = fileInput} accept="image/*"/>
          <i className="far fa-image" id="makePostImageIcon" onClick={() => fileInputPlaceholder.click()}></i>
        </div>
      </div>
      <div className="progress" style={{width : '100%', display : 'none', backgroundColor : '#ab7efb', margin : 0}} id="makePostProgressBar">
        <div className="determinate" id="determinate" style={{width : '0%', backgroundColor : '#673ab7'}}></div>
      </div>
    </div>
  )
}

export default MakePost
