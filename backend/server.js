const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")

require('dotenv').config();

// Initialize the express app
const app = express();
const port = 5000;

// Body Parser middleware to parse incoming JSON
app.use(bodyParser.json());
app.use(cors());



app.use('/api',userRoutes)
app.use('/',cartRoutes)


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
