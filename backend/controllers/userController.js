const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');



const registerUser = async(req,res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }
  
    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
  
    // Check password length
    if (password.length < 5) {
      return res.status(400).json({ error: 'Password should be at least 5 characters long' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

  
    // Insert user into MySQL
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  };

  const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
  
      if (!rows.length) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token valid for 1 hour
      );
  
      res.status(200).json({
        message: 'Login successful',
        token, // Return the token to the client
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

module.exports = {registerUser, loginUser}