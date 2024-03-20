const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDb = require("./config/db");
const userRouters = require("./routers/userRouter");

const { notFound, errorHandler } = require("./middleware/errrorMiddleware");
dotenv.config();

connectDb();

const port = process.env.PORT || 5000; 


const app = express();
app.use(express.static('static')); 

//body Parser middleware..
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// that will allow us to send form data
app.use(express.urlencoded({ extended: true }));
 
app.use('/api/users', userRouters);

// gitHub login page
app.get('/', (req, res) => {
    res.send(`
    <h1>Welcome to the GitHub Login Page</h1>
    <a id="sign-in-with-github" href="/api/users/auth">Sign in with GitHub</a>
    `);
});  

app.get('/', (req, res) => res.send("Server is Running"));

// middleware custom error 
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));







// - ** POST /api/users ** - Register a user
// - ** POST /api/users/auth ** - Authenticate a user and get token
// - ** POST /api/users/logout ** - Logout user and clear cookie
// - ** GET /api/users/profile ** - Get user profile
// - ** PUT /api/users/profile ** - Update profile