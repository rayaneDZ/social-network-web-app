import axios from 'axios';
import storage from '../../main.jsx'
import '../css/postheading.css';

const style = {
    flex : {
        display : 'flex'
    },
    metadata_picture : {
        width : 50,
        height: 50,
        backgroundColor : 'grey',
        borderRadius: '50%',
        marginRight : 20
    },
    metadata_picture_container : {
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '50%',
        marginRight : 20
    },
    heading : {
        display : 'flex',
        alignItems : 'flex-start',
        justifyContent : 'space-between'
    },
    button : {
        border : 'none',
        padding : 10,
        backgroundColor : 'transparent'
    }
}

function PostHeading(props) {
    let myDropDownElement;

    const toggleDropDown = () =>{
        let dropdownOpacity = myDropDownElement.style.opacity;
        if(dropdownOpacity === '0'){
            myDropDownElement.style.visibility = "visible";
            myDropDownElement.style.opacity = "1";
        }else {
            myDropDownElement.style.visibility = "hidden";
            myDropDownElement.style.opacity = "0";
        }
    }

    const deletePost = () => {
        const data = {
            'postId' : props.postID,
            'user' : localStorage.getItem('username')
        }
        axios({
            method : 'post',
            url : '/api/post/delete',
            data : data,
            headers : {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(() => {
            props.deletePost(props.postID)
            if(props.image_uuid){
                storage.ref().child('posts_pictures/' + props.image_uuid).delete()
                .then(() => {
                console.log('old pp deleted successfully')
                }).catch(() => {
                console.log('old pp could not be deleted')
                })
            }
        }).catch(err => {
            if(err.response.data.message === "Auth failed"){
            alert('you need to LOG IN')
            }
        })
    }

    return (
        <div className="heading" style = {style.heading}>
            <div className="metadata" style = {style.flex}>
                {
                    props.PPP.length > 0 ?
                        <div style = {style.metadata_picture_container}>
                            <img src={props.PPP} style={style.metadata_picture} alt="profile pic of the user"/>
                        </div>
                    :
                        <div style={style.metadata_picture}></div>
                }
                <div className="info">
                    <div className="user_name" style={{fontWeight:'bold'}}><a href = {`/profile/${props.user}`}>{props.user}</a></div>
                    <div className="when"><p style={{fontSize : 10, margin : 0}}>{props.date}</p></div>
                </div>
            </div>
                {props.user === localStorage.getItem('username') ?
                    <>
                        <button style = {style.button} onClick={toggleDropDown}><i className="fa fa-ellipsis-v" style={{fontSize : 26}}></i></button>
                        <div id="postDropDown" ref={input => {myDropDownElement = input}}>
                            <div onClick={deletePost}><i className="fa fa-trash " style={{marginRight : 10}}></i>Delete</div>
                        </div>
                    </>
                :
                    <></>
                }
        </div>
    )
}

export default PostHeading;
