import '../css/logsignupdated.css';
import { useJwt } from "react-jwt";
import axios from 'axios';

const style = {
    wrongformat : {
      fontSize : 12,
      fontWeight : 'blod',
      color : 'tomato',
      display : 'none'
    },
    signupcolor:{
      color: 'white'
    }
}

function LogSign(){
    const handleSignUp = () => {
        //GETTING FORM VALUES
        const email = document.getElementById('email').value;
        const username = document.getElementById('signup_username').value;
        const password = document.getElementById('signup_password').value;
        if (validateSignUp(email, password, username)){
          console.log(username)
          //INITIALIZING SPANS
          document.getElementById('email_span').style.display= "none";
          document.getElementById('taken_email_span').style.display= "none";
          document.getElementById('username_span').style.display= "none";
          document.getElementById('taken_username_span').style.display= "none";
          document.getElementById('password_span').style.display= "none";

          document.getElementById("chk").checked = true;
          document.getElementById("chk").ariaHidden = false;
          document.getElementById("chk").display = "block";
    
          //AXIOS REQUEST
          axios.post('/api/signup', { 
            'email' : email,
            'username' : username.toLowerCase(),
            'password' : password
          }).then(res => {
            //this is handled in the then because the server responds with a 201
              if (res.data.message === "success"){
                console.log("account created successfully")
              }
              
          }).catch(err => {
            //this is handled in the catch because the server responsed with a 409 status
            let message = err.response.data.message;
            if(message === "email"){
              document.getElementById('taken_email_span').style.display= "block";
            }else if (message === "username"){
              document.getElementById('taken_username_span').style.display= "block";
            }
          })
        }
      }
      const validateEmail = (email) =>{
        const re = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        return re.test(String(email).toLowerCase());
      }
      const validateSignUp = (email, password, username) => {
        if(password.length < 6){
          document.getElementById('password_span').style.display= "block";
        }else{
          document.getElementById('password_span').style.display= "none";
        }
        if(username.length < 4){
          document.getElementById('username_span').style.display= "block";
        }else{
          document.getElementById('username_span').style.display= "none";
        }
        if(!validateEmail(email)) {
          document.getElementById('email_span').style.display= "block";      
        }else {
          document.getElementById('email_span').style.display= "none";
        }
        if (password.length >= 6 && validateEmail(email)){
          document.getElementById('username_span').style.display= "none";
          document.getElementById('email_span').style.display= "none";
          document.getElementById('password_span').style.display= "none";
          return true;
        }else{
          return false;
        }
      }
    const handleLogIn = () => {
        //GETTING FORM VALUES
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        //INITIALIZING SPANS
        document.getElementById('wrong_username_or_password_span').style.display = 'none';

        //AXIOS REQUEST
         axios.post('/api/login', {
            'username' : username.toLowerCase(),
            'password' : password
        }).then(res => {
          console.log("sucesss")
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username); 
            localStorage.setItem("profile_picture_path", res.data.profile_picture_path);
            window.location.href = '/home';
        }).catch(err => {
            console.log(err)
            document.getElementById('wrong_username_or_password_span').style.display = 'block';
        })
    }
    const content = (
        <div className="logsign-card-container">
          <div className="logsign-card">
            <input className="logsign-input" type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup-section">
                <label className='label-title' htmlFor="chk" aria-hidden="true" style={style.signupcolor}>Sign up</label>

                <input className="logsign-input" type="email" name="email" placeholder="Email" id="email"/>
                <span style={style.wrongformat} id="email_span" className='error-indicator'>*Enter a valid email</span>
                <span style={style.wrongformat} id="taken_email_span" className='error-indicator'>*There's already an account associated with this email</span>
                
                <input className="logsign-input" type="text" name="txt" placeholder="Username" id="signup_username"/>
                <span style={style.wrongformat} id="username_span" className='error-indicator'>*Username must be at least 4 characters long</span>
                <span style={style.wrongformat} id="taken_username_span" className='error-indicator'>*Username taken</span>
                
                <input className="logsign-input" type="password" name="pswd" placeholder="Password" id="signup_password"/>
                <span style={style.wrongformat} id="password_span" className='error-indicator'>*Password must be at least 6 characters long</span>

                <button className="logsign-button" onClick={handleSignUp}>Sign up</button>
            </div>

            <div className="login-section">
                    <label className='label-title' htmlFor="chk" aria-hidden="true">Login</label>
                    <span style={style.wrongformat} id="wrong_username_or_password_span">*Wrong username or password</span>
                    <input className="logsign-input" type="text" placeholder="Username"  id="username"/>
                    <input className="logsign-input"
                        type="password"
                        placeholder="Password"
                        id="password"
                    />
                    <button className="logsign-button" onClick={handleLogIn}>Login</button>
            </div>
        </div>
        </div>
        
    )

    if(localStorage.getItem('token')){
        const token = localStorage.getItem('token');
        const { decodedToken, isExpired } = useJwt(token);
        if (isExpired)
            return content
        else
            window.location.href = "/home";
    }else
        return content
}

export default LogSign;