import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (user_id) => {
    const response = await axios.get(`http://localhost:5000/cart?user_id=${user_id}`);
    return response.data;
});

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ food_id, user_id, action }) => {
      const response = await axios.put("http://localhost:5000/cart/updateQuantity", {
          food_id,
          user_id,
          action, // "increase" or "decrease"
      });
      return response.data; // Updated cart data from the backend
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ food_id, user_id }, thunkAPI) => {
      try {
          const response = await axios.delete(`http://localhost:5000/cart/delete`, {
              data: { food_id, user_id }, // Pass body in DELETE request
          });
          return response.data; // Return updated cart items
      } catch (error) {
          console.error('Error deleting cart item:', error);
          return thunkAPI.rejectWithValue(error.response.data);
      }
  }
);

// Async thunk to clear the entire cart
export const clearCartItems = createAsyncThunk(
  'cart/clearCartItems',
  async (user_id) => {
    const response = await axios.delete(`http://localhost:5000/cart/clear`, {
      data: { user_id },
    });
    console.log("Clear cart response:", response.data);  // Add this to check the response
    return response.data; // Backend returns the updated cart (empty in this case)
  }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        totalAmount: 0,
    },
    reducers:{
        addTocart(state,action){
            const itemIndex=state.cartItems.findIndex((ele)=>ele.id===action.payload.id);
            if(itemIndex>=0){
                state.cartItems[itemIndex].cartQuantity+=1;
            }else{
                const temproduct={...action.payload,cartQuantity:1};
                state.cartItems.push(temproduct);
            }
            
        },
        // removeCartItem(state,action){
        //    const newCart= state.cartItems.filter(
        //         ele=> ele.id!==action.payload.id
        //     );
        //     state.cartItems=newCart;
        // },
        // decreaseCart(state,action){
        //     const itemIndex=state.cartItems.findIndex((ele)=>ele.id===action.payload.id)
        //     if(state.cartItems[itemIndex].cartQuantity>1){
        //         state.cartItems[itemIndex].cartQuantity-=1;
        //     }
        // },
        // clearCartItem(state,action){
        //     state.cartItems=[];
        // },
        getTotals(state,action){
           let {total,quantity}= state.cartItems.reduce((cartTotal,ele)=>{
                const {rate,cartQuantity}=ele;
                const itemTotal=rate*cartQuantity;

                cartTotal.total+=itemTotal
                cartTotal.quantity+=cartQuantity

                return cartTotal
            },{
                total:0,
                quantity:0
            })
            state.totalAmount=total;
            state.cartTotalQUantity=quantity
        },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchCartItems.fulfilled, (state, action) => {
          state.cartItems = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload; // Update state with new cart items
    })
    .addCase(deleteCartItem.fulfilled, (state, action) => {
      state.cartItems = action.payload; // Update cart items after deletion
  })
  .addCase(clearCartItems.fulfilled, (state, action) => {
    console.log("Action payload:", action.payload);  // Check what you get in the response
    state.cartItems = []; // Update cart items after deletion
    state.totalAmount = 0; // Reset totalAmount
    state.cartTotalQuantity = 0; // Reset quantity
  });
  },
});

export const { addTocart, removeCartItem, decreaseCart, clearCartItem, getTotals } = cartSlice.actions;
export default cartSlice.reducer;