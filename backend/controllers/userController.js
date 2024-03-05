const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const generateToken = require("../utils/generateToken");


// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name, 
            email: user.email,
        });
    }else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
    // res.status(200).json({ message: 'Auth User'}); 
});


// @desc    Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body;  
    // console.log(req.body);
    const userExists = await User.findOne({ email });

    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    } 
    const user = await User.create({
        name,
        email,
        password
    });
 
    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name, 
            email: user.email,
        });
    }else {
        res.status(400);
        throw new Error("Invalid user data");
    }
    res.status(200).json({ message: 'Register User'});
});


// @desc    Logout user/clear cookie
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler( async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });    
    
    res.status(200).json({ message: 'User logged out'});
});


// @desc    Get user profile
// route    POST /api/users/profile
// @access  Public
const getUserProfile = asyncHandler( async (req, res) => {
    
    res.status(200).json({ message: 'User profile'});
});


// @desc    Update profile
// route    PUT /api/users/profile
// @access  private
const updateUser = asyncHandler( async (req, res) => {
    
    res.status(200).json({ message: 'Updated user profile '});
});

module.exports = { authUser, registerUser, logoutUser, getUserProfile, updateUser }; 



    


// - ** POST /api/users ** - Register a user
// - ** POST /api/users/auth ** - Authenticate a user and get token
// - ** POST /api/users/logout ** - Logout user and clear cookie
// - ** GET /api/users/profile ** - Get user profile
// - ** PUT /api/users/profile ** - Update profile