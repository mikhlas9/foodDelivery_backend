const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');



const addTocart = async(req,res) => {
    const { user_id, food_id, title, rate, quantity } = req.body;

    // Insert into `cart_items` table
    const query = `INSERT INTO cart_items (user_id, food_id, title, rate, quantity) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [user_id, food_id, title, rate, quantity], (err, result) => {
      if (err) {
        console.error("Error adding item to cart:", err);
        return res.status(500).json({ error: "Failed to add item to cart" });
      }
      res.status(200).json({ message: "Item added to cart successfully" });
    });
}

// Fetch cart items for a specific user
const getCartItems = async (req, res) => {
    const user_id = req.query.user_id; // Extract user_id from query parameters
    

    // Ensure user_id exists
    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch cart items for the given user
    const query = `SELECT * FROM cart_items WHERE user_id = ?`;
    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error fetching cart items:", err);
            return res.status(500).json({ error: "Failed to fetch cart items" });
        }

        // Send the result (cart items) as JSON
        res.status(200).json(result);
    });
};

const updateCartQuantity = async (req, res) => {
    const { food_id, user_id, action } = req.body;

    // Ensure food_id and user_id exist in the request
    if (!food_id || !user_id) {
        return res.status(400).json({ error: "food_id and user_id are required" });
    }

    // Fetch the cart item to get the current quantity
    const querySelect = "SELECT quantity FROM cart_items WHERE food_id = ? AND user_id = ?";
    db.query(querySelect, [food_id, user_id], (err, result) => {
        if (err || result.length === 0) {
            console.error("Error finding cart item:", err);
            return res.status(500).json({ error: "Failed to find cart item" });
        }

        let currentQuantity = result[0].quantity; // Ensure this is treated as an integer
        currentQuantity = parseInt(currentQuantity, 10); // Convert to integer for safety

        // Update the quantity based on the action
        let newQuantity = currentQuantity;
        if (action === "increase") {
            newQuantity += 1; // Increment quantity
        } else if (action === "decrease" && currentQuantity > 1) {
            newQuantity -= 1; // Decrement quantity (minimum quantity is 1)
        }

        // Update the quantity in the database
        const queryUpdate = "UPDATE cart_items SET quantity = ? WHERE food_id = ? AND user_id = ?";
        db.query(queryUpdate, [newQuantity, food_id, user_id], (updateErr) => {
            if (updateErr) {
                console.error("Error updating quantity:", updateErr);
                return res.status(500).json({ error: "Failed to update quantity" });
            }

            // Fetch updated cart items to return
            const queryFetch = "SELECT * FROM cart_items WHERE user_id = ?";
            db.query(queryFetch, [user_id], (fetchErr, cartItems) => {
                if (fetchErr) {
                    console.error("Error fetching updated cart items:", fetchErr);
                    return res.status(500).json({ error: "Failed to fetch updated cart items" });
                }
                res.status(200).json(cartItems);
            });
        });
    });
};

const deleteCartItem = async (req, res) => {
    const { food_id, user_id } = req.body;

    if (!food_id || !user_id) {
        return res.status(400).json({ error: "food_id and user_id are required" });
    }

    const queryDelete = "DELETE FROM cart_items WHERE food_id = ? AND user_id = ?";
    db.query(queryDelete, [food_id, user_id], (err, result) => {
        if (err) {
            console.error("Error deleting item from cart:", err);
            return res.status(500).json({ error: "Failed to delete item from cart" });
        }

        // Fetch updated cart items to return after deletion
        const queryFetch = "SELECT * FROM cart_items WHERE user_id = ?";
        db.query(queryFetch, [user_id], (fetchErr, cartItems) => {
            if (fetchErr) {
                console.error("Error fetching updated cart items:", fetchErr);
                return res.status(500).json({ error: "Failed to fetch updated cart items" });
            }

            res.status(200).json(cartItems);
        });
    });
};
// Backend - After clearing the cart, return the updated cart state
const clearCart = async (req, res) => {
    const { user_id } = req.body;  // Extract user_id from the request body

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // SQL query to delete all items from the cart for the given user
    const queryDelete = "DELETE FROM cart_items WHERE user_id = ?";
    db.query(queryDelete, [user_id], (err, result) => {
        if (err) {
            console.error("Error clearing cart:", err);
            return res.status(500).json({ error: "Failed to clear cart" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No cart items found for this user" });
        }

        // Fetch the updated cart (empty in this case) and send it in the response
        const queryGetCart = "SELECT * FROM cart_items WHERE user_id = ?";
        db.query(queryGetCart, [user_id], (err, rows) => {
            if (err) {
                console.error("Error fetching updated cart:", err);
                return res.status(500).json({ error: "Failed to fetch updated cart" });
            }
            res.status(200).json(rows);  // Return the empty cart or the updated cart
        });
    });
};







module.exports = { addTocart, getCartItems, updateCartQuantity, deleteCartItem, clearCart };



