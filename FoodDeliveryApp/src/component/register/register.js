import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "../register/register.css"
function Register(){
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setpassword]=useState('')
    const [nameErr,setnameErr]=useState(false)
    const navigate = useNavigate()
    function registertration(){
        if((username.trim().length===0)||(password.trim().length===0)||(email.trim().length===0)){
            setnameErr(true);
        }
        else if(!email.includes('@','.','com')){
            alert('please Enter valid email address');
        }
        else if(password.length<5){
            alert('please enter the password more than five characters');
        }
        else{
            setnameErr(false);
            
            // Sending POST request to the backend
            fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    navigate('/login');
                } else {
                    alert(data.error || 'Something went wrong!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Server error!');
            });
        }
    }
    
    return(
        <div className="register-body">
        <div className="register-main">
            <h1>Register Form</h1>
            {nameErr&& <p className="errP">*please fill every input field*</p>}
            <br />
            <p>Name</p>
            <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}></input>
            <br />
            <p>Email</p>
            <input type='text'value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
            <br />
            <p>Password</p>
            <input type='password'value={password} onChange={(e)=>{setpassword(e.target.value)}}></input>
            <br /><br />
            <button onClick={registertration}>Register</button>
        </div>
        </div>
    )
}
export default Register