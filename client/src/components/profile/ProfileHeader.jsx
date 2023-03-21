import React, { useState } from 'react';
import '../css/profileheader.css';
import ImageCompressor from 'image-compressor.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import storage from '../../main';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

function ProfileHeader (props) {
  
  const [toggleEdit, setToggleEdit] = useState(false);
  const [ppp, setPPP] = useState(props.user.profile_picture_path);
  const [pp_uuid, setPP_uuid] = useState(props.user.pp_uuid);

  //pp_uuid_helper is declared so i can submit it to data = base along with the url of the image
  //(which already contains the uuid but it is hard to extract)
  //the image name in firebase is the uuid but it's link is not the uuid
  //so i have to store the uuid in order to delete it when the user updates the image
  let pp_uuid_helper = ""

  let fileInputPlaceholder;
  
  const toggleEditFunction = () => {
    setToggleEdit(!toggleEdit)
  }

  const handleFile = (e) =>{
    const image = e.target.files[0]
    //const _this = this
    const compressDownTo = 500000

    if(image.size > compressDownTo){
      console.log('compressing...')
      const quality = 1/(image.size/compressDownTo);
      new ImageCompressor(image, {
        quality: quality,
        success(compressedImage) {
          //_this.uploadToFirebase(compressedImage);
          uploadToFirebase(compressedImage);
        },
        error(e) {
          console.log(e.message);
        },
      });
    }else{
      console.log('upload without compressing')
      uploadToFirebase(image)
    }
  }
  const uploadToFirebase = (compressedImage) => {
    let progressBar = document.getElementById('profileHeaderProgressBar');
    progressBar.style.display = 'block'
    // Upload file and metadata =  to the object 'profile_pictures/"name".jpg'
    pp_uuid_helper = uuidv4()

    const storageRef = ref(storage, `profile_pictures/${pp_uuid_helper}`);
    const uploadTask = uploadBytesResumable(storageRef, compressedImage);
    //const uploadTask = storage.ref().child('profile_pictures/' + pp_uuid_helper).put(compressedImage);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on("state_changed", (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        document.getElementById('determinate').style.width = progress + '%'
      }, (error) =>{
        console.log('error from firebase when uploading ...', error)
    }, () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        progressBar.style.display = 'none'
        //delete old profile picture from firebase if it exists
        if(pp_uuid.length > 0){
          console.log('deleting old profile picture ...')
          const desertRef = ref(storage, 'profile_pictures/' + pp_uuid);
          deleteObject(desertRef)
          .then(() => {
            console.log('old profile picture deleted successfully')
          }).catch(() => {
            console.log('old profile picture could not be deleted')
          })
        }
        //API POST REQUEST TO CHANGE USER profile picture and to change posts ppp of the user
        const data = {
          username : props.user.username,
          ppp : downloadURL,
          pp_uuid : pp_uuid_helper
        }
        axios({
          method: 'post',
          url : '/api/user/updateProfilePicture',
          data : data,
          headers : {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(()=>{
          setPPP(downloadURL)
          setPP_uuid(pp_uuid_helper)
          console.log('everything executed successfully !')
        }).catch(err => {
          if(err.response.data.message === "Auth failed"){
            alert('your session timed out, please log back in')
          }
      })
      });
    });
  }
  return (
    <div id="PHContainer">
        {
          ppp.length > 0 ?
            <div className="PHPPcontainer">
              <img src={ppp} id="PHProfilePicture" alt="profile pic of the user"/>
            </div>
          :
            <div style={{height: 200, width: 200, borderRadius : "50%", backgroundColor : "grey"}}></div>
        }
        <div className="progress" style={{marginTop : 20, width : 200, display : 'none', backgroundColor : '#ab7efb'}} id="profileHeaderProgressBar">
          <div className="determinate" id="determinate" style={{width : '40%', backgroundColor : '#673ab7'}}></div>
        </div>
        <h3>{props.user.username}</h3>

        {
          props.user.username !== localStorage.getItem('username') ?
          <div></div>
          :
            <button id="editProfileButton" onClick = {toggleEditFunction}>Edit Profile</button>
        }

        {
          toggleEdit ?
            <div id ="editProfileDiv">
              <input type="file" onChange={handleFile} style={{display :'none'}} ref={fileInput => fileInputPlaceholder = fileInput} accept="image/*"/>
              <div className="editProfileSubButtons" onClick={() => fileInputPlaceholder.click()}>
                {localStorage.getItem('profile_picture_path').length > 0 ? "Change Profile Picture" : "Add Profile Picture"} 
              </div>
            </div>
          :
            <React.Fragment></React.Fragment>
        
        }

        <p>{props.user.bio}</p>
    </div>
  )
}

export default ProfileHeader
