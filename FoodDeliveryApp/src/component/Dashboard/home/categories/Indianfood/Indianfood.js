import React from "react";
import '../categories.css';
import Food from "../../../../foodimage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import axios from 'axios';  // Import axios
import '../../../header/header.css';

function Indianfood() {
    const dispatch = useDispatch();
    let Food1 = Food.filter((ele) => ele.titlename === 'IndianFood');
    let navigate = useNavigate();

    // Function to send request to backend (e.g., for adding an item to the cart)
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

    function AddtoCart(ele) {
        dispatch(addTocart(ele));  // Redux action to add to cart
        sendToBackend(ele);  // Send item details to backend
    }

    function prevImage() {
        let box = document.querySelector('.card-image');
        let width = box.clientWidth;
        box.scrollLeft = box.scrollLeft - width;
    }

    function nextImage() {
        let box = document.querySelector('.card-image');
        let width = box.clientWidth;
        box.scrollLeft = box.scrollLeft + width;
    }

    function detail(id) {
        navigate(`/singledish?id=${id}`);
    }

    function Alldish(titleId) {
        navigate(`/alldish?id=${titleId}`);
    }

    function order() {
        navigate('/cart');
    }

    return (
        <div className="indi-css">
            {/* <h2>Categories</h2> */}
            <h3>Indian Food</h3>

            <div className="main-image">
                <button className="leftImageArrowStyles" onClick={() => prevImage()}> ❰❰</button>
                <button className="rightImageArrowStyles" onClick={() => nextImage()}> ❱❱</button>
                <div className="card-image">
                    {Food1.map((ele) => {
                        return (
                            <div key={ele.id} className="Perslide">
                                <img src={ele.url} alt={ele.title} onClick={() => detail(ele.id)}></img>
                                <p>{ele.title}{" "}[{ele.quantity}]</p>
                                <span style={{ display: 'block' }}>₹{ele.rate}</span>
                                <button className="slide-cart-button" onClick={order}>Order</button>
                                <button className="slide-cart-button" onClick={() => AddtoCart(ele)}>+Add toCart</button>
                            </div>
                        );
                    })}
                    <button onClick={() => Alldish(Food1[0].titleId)} className="imsa">See more</button>
                </div>
            </div>

        </div>
    );
}

export default Indianfood;
