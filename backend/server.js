const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const userRouters = require("./routers/userRouter")
const { notFound, errorHandler } = require("./middleware/errrorMiddleware");
dotenv.config();

connectDb();

const port = process.env.PORT || 5000;

const app = express();

//body Parser middleware..
app.use(express.json());

// that will allow us to send form data
app.use(express.urlencoded({ extended: true }));
 
app.use('/api/users', userRouters);

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