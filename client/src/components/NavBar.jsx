import SearchBar from './SearchBar';
import './css/navbar.css';

const style = {
  flex : {
    display : 'flex',
    alignItems : 'center'
  },
  anchors : {
    padding : 20,
    color : 'white',
    height : '50%'
  }
}

function NavBar () {
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profile_picture_path");
    window.location.href = "/";
  }
  const toggleMenu = () => {
    const menuval = document.getElementById('hamburgerMenu').style.display;
    if (menuval === 'none') {
      document.getElementById('hamburgerMenu').style.display = "block";
    }else {
      document.getElementById('hamburgerMenu').style.display = "none";      
    }
  }
  return (
    <>
      <div id="navbarContainer">
        <i className="fa fa-bars" onClick={toggleMenu}></i>  
        <div id="leftSideNav" style={style.flex}>
            <a href="/home" id="whatever"><i style={style.anchors} className="material-icons white-text">home</i></a>
            {
              localStorage.getItem('username') ?
                <a href={`/profile/${localStorage.getItem('username')}`}><i style={style.anchors} className="material-icons white-text">person</i></a>
              :
                <></>
            }
            <a href="/messages"><i style={style.anchors} className="material-icons white-text">message</i></a>
        </div>
        <SearchBar/>
        <div id="rightSideNav">
          <a style={style.anchors} href="/" onClick={logOut}>Log Out</a>
        </div>
      </div>
      <div id="hamburgerMenu">
        <div className="hambElem">
          <a href="/home"><h6>Home</h6></a>
        </div>
        { 
        localStorage.getItem('username') ?
          <div className="hambElem">
            <a href={`/profile/${localStorage.getItem('username')}`}><h6>Profile</h6></a>
          </div>
        :
          <></>
        }
        <div className="hambElem">
          <a href="/messages"><h6>Messages</h6></a>
        </div>
        <div className="hambElem">
          <a href="/" onClick={logOut}><h6>Log Out</h6></a>
        </div>
      </div>
    </>
  )
}

export default NavBar
