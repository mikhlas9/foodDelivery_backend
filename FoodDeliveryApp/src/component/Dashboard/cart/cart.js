import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems, removeCartItem, clearCartItems, addTocart, decreaseCart, getTotals, updateCartQuantity, deleteCartItem} from "./cartslice";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import '../cart/cart.css';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        // Fetch user info from localStorage
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            dispatch(fetchCartItems(user.user.id)); // Fetch cart items for the user
        }
        dispatch(getTotals()); // Update totals
    }, [cart.cartItems, dispatch]);

    function detail(id) {
        navigate(`/singledish?id=${id}`);
    }

    function remove(cartItem) {
      const user = JSON.parse(localStorage.getItem('userInfo')); // Get user details
      dispatch(deleteCartItem({ 
          food_id: cartItem.food_id, 
          user_id: user.user.id 
      }));
  }
  

    function increase(cartItem) {
      const user = JSON.parse(localStorage.getItem("userInfo")); // Fetch logged-in user
      dispatch(updateCartQuantity({ 
          food_id: cartItem.food_id, 
          user_id: user.user.id, 
          action: "increase" 
      }));
  }
  
  function decrease(cartItem) {
      const user = JSON.parse(localStorage.getItem("userInfo")); // Fetch logged-in user
      if (cartItem.quantity > 1) {
      dispatch(updateCartQuantity({ 
          food_id: cartItem.food_id, 
          user_id: user.user.id, 
          action: "decrease" 
      }));
    }
  }
  
  function clearcart() {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
        const user = JSON.parse(localStorage.getItem('userInfo')); // Get user details
        dispatch(clearCartItems({ 
            user_id: user.user.id 
        }));
    }
}


    function order() {
        alert('Your order placed successfully!!');
        dispatch(clearCartItems());
    }

    return (
        <div className="cart-bg">
            <Header />
            <div className="cart"><h1 style={{ padding: '10px' }}>Shopping cart</h1>
                {
                    cart.cartItems.length === 0 ? (
                        <div style={{ marginBottom: '165px', padding: '10px' }}>
                            <p>Your cart is currently empty</p>
                        </div>
                    ) : (
                        <div className="cart-main">
                            <div className="cart-main-head">
                                <h3 className="cart-main-head-h3">Product</h3>
                                <h3>Price</h3>
                                <h3>Quantity</h3>
                                <h3>Total</h3>
                            </div>

                            {
                                cart.cartItems?.map(cartItem => (
                                    <div key={cartItem.food_id} className="cart-main-body">
                                        <div className="cart-main-body-div">
                                            <img src={cartItem.url} alt={cartItem.title} onClick={() => detail(cartItem.food_id)} />
                                            <div style={{ paddingLeft: '5px' }}>
                                                <h3>{cartItem.title}</h3>
                                                <button onClick={() => remove(cartItem)}>Delete</button>
                                            </div>
                                        </div>

                                        <div className="cart-main-body-div2"><h5>₹{cartItem.rate}</h5></div>

                                        <div className="quantity">
                                            <button onClick={() => decrease(cartItem)}>-</button><span>{cartItem.quantity}</span>
                                            <button onClick={() => increase(cartItem)}>+</button>
                                        </div>

                                        <div className="cart-main-body-div2">
                                            <div style={{ color: 'green', fontSize: '23px' }}>₹{cartItem.quantity * cartItem.rate} </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '1100px', marginLeft: '10px' }}>
                                <div>
                                    <button className="clearCart-button" onClick={() => clearcart()}> Clear cart </button>
                                </div>
                                <div>
                                    <p>Subtotal <span style={{ fontSize: '12px' }}>*including all taxes*</span>: <b><span style={{ fontSize: '23px' }}> ₹{cart.totalAmount}/-</span></b></p>

                                    <button className="Order-button " onClick={order}>Order</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
