import React, { useState } from "react";
import '../register/register.css'
import { Link, useNavigate } from "react-router-dom";
function Login(){
    const [loginName,setLoginName]=useState('')
    const [loginPassword,setLoginPassword]=useState('')
    const [loginNameErr,setLoginNameErr]=useState(false)
    const [loginPasswordErr,setPasswordErr]=useState(false)
    const [incorrectErr,setincorrectErr]=useState(false)
   //  function showpassword(e){
   //    if(e.type === "password"){
   //       e.type='text'
   //    }
   //    else{
   //       e.type ="password"
   //    }
   //  }
      const navigate = useNavigate()
      function Loginvalidation() {
         if (loginName.trim().length === 0) {
           setLoginNameErr(true);
         } else {
           setLoginNameErr(false);
         }
       
         if (loginPassword.trim().length === 0) {
           setPasswordErr(true);
         } else {
           setPasswordErr(false);
         }
       
         if (loginName.trim().length > 0 && loginPassword.trim().length > 0) {
           fetch('http://localhost:5000/api/login', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               username: loginName,
               password: loginPassword,
             }),
           })
             .then((response) => {
               if (!response.ok) {
                 throw new Error('Invalid username or password');
               }
               return response.json();
             })
             .then((data) => {
                 // Save the token in localStorage
                 
                 localStorage.setItem("userInfo", JSON.stringify(data));

               navigate('/home');
             })
             .catch((error) => {
               console.error(error);
               setincorrectErr(true);
             });
         }
       }
       
  return(
        <div className="login-body">
        <div className="login-main">
            <h1>Login </h1>   
            {incorrectErr&& <small style={{color:'red',textAlign:'center'}}> Enter the correct username and password</small>}   
            <br />
             <p>Name</p>
            <input type='text' value={loginName} onChange={(e)=>{setLoginName(e.target.value)}}></input>
             {loginNameErr&& <small  style={{color:'#d3521d'}}>Please enter the Username</small>}
            <br />
            <p>Password</p>
            <input type='password' value={loginPassword} onChange={(e)=>{setLoginPassword(e.target.value)}}></input>
             {loginPasswordErr&& <small  style={{color:'#d3521d'}}>Please enter the password </small>}
            {/* <div>
            <input type="checkbox" onclick={()=>showpassword(loginPassword)} />Show Password
            </div> */}
            <br />
          
            <button onClick={Loginvalidation}>Login</button><br />
            <p style={{fontSize:'15px'}}>Doesn't have an account yet? <Link to={'/'}>Sign up</Link></p>
        </div>

        </div>
    )
}
export default Login