import React from "react";
import logo from '../image/food.png'
import cartimg from '../image/cart.jpg'
import '../header/header.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header(){
    const {cartTotalQUantity}=useSelector((state)=>state.cart)
    let navigate = useNavigate()
    function AddCart(){
        navigate('/cart')
    }
    function Profile(){
        navigate('/profile')
    }
    function gotoHome(){
        navigate('/home')
    }
    function Logout(){
        localStorage.removeItem("userInfo"); // Removes specific user data

        navigate('/login')
    }
    return(
        <div className="header">
            <img src={logo} className='logo'></img>
            <div><input type='text' className="search-input"/><button >Search</button></div>

            <div style={{position:'relative',width:'100px'}}><button className="cart-button" onClick={AddCart}><img  src={cartimg}></img></button>
            <span className="msg"> {cartTotalQUantity}</span></div>
             {' '}
            <button className="cart-button" ><p style={{color:"white",marginTop:'12px'}} onClick={gotoHome}>Home</p></button>
            <button className="cart-button"  ><p style={{color:"white",marginTop:'12px'}} onClick={Profile}>Profile</p></button>  
            <button className="cart-button"  ><p style={{color:"white",marginTop:'12px'}} onClick={Logout}>Log out</p></button>  
        </div>
    )
}

export default Header