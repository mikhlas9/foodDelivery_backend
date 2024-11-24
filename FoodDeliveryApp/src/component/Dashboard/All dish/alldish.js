import React from "react";
import Food from "../../foodimage";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import Header from "../header/header";
import { addTocart } from "../cart/cartslice";
import { useDispatch,useSelector } from "react-redux";
import { getTotals } from "../cart/cartslice";
import axios from 'axios';  // Import axios


function Alldish(){
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const location=useLocation();
    const [detail,setdetail]=useState([])

    async function sendToBackend(item) {
        try {
            const user = JSON.parse(localStorage.getItem("userInfo")) 
            if(!user){
                console.log("no token");
                
            }
            
            const response = await axios.post("http://localhost:5000/add-to-cart", {
                user_id: user.user.id,
                food_id: item.id,
                title: item.title,
                rate: item.rate,
                quantity: item.quantity
            });
            console.log('Item added to backend:', response.data);
        } catch (error) {
            console.error('Error sending to backend:', error);
        }
    }


    useEffect(()=>{
        let data = Food.filter((ele)=>ele.titleId==query.get('id'));
        console.log(data)
        setdetail(data)
       
    },[])
    const cart=useSelector((state)=>state.cart)
    useEffect(()=>{
        
        dispatch(getTotals())
    },[cart,dispatch])
    let query = new URLSearchParams(location.search)
    function detailed(id){
        navigate(`/singledish?id=${id}`)
    }
    function order(){
        navigate('/cart')
    }
    function AddtoCart(ele){
        dispatch(addTocart(ele))
        sendToBackend(ele);  // Send item details to backend

    }
    return(
        <div className="sfp-bg">
            <Header />
           
            <div className="All-dish-card">
            {
                detail.map((ele)=>{
                    return <div key={ele.id} className='Perslide'>
                    <img src={ele.url} alt={ele.title} onClick={()=>detailed(ele.id)}></img>
                    <p>{ele.title}{' '}[{ele.quantity}]</p>
                    <span style={{display:'block'}}>₹{ele.rate}</span>
                    <button className="slide-cart-button" onClick={order}>Order</button>{'  '}<button className="slide-cart-button" onClick={()=>AddtoCart(ele)}>+Add toCart</button>
                </div>
                
                })
            }
            </div>
             
            <Footer />
        </div>
    )
}

export default Alldish