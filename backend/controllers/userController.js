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

// @desc Auth user/set gitHub
// route get /api/users/auth
// @access Public
const gitHubAuthuser =asyncHandler( async  (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
});

const oAuthCallback =asyncHandler( async (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const code = req.query.code;
  
    try {
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }, {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const accessToken = response.data.access_token;
      // Use the access token to make API requests on behalf of the user
      res.send(`<h1>Login Sucessful</h1> Access token: ${accessToken}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during authentication.');
    }
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
// @access  Private
const getUserProfile = asyncHandler( async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    }
    
    res.status(200).json(user);
});



// @desc    Update profile
// route    PUT /api/users/profile
// @access  private
const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        };

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    }else{
        res.status(404);
        throw new Error("User Not Found !");
    };
    
});

module.exports = { authUser,gitHubAuthuser,oAuthCallback, registerUser, logoutUser, getUserProfile, updateUser }; 



    


// - ** POST /api/users ** - Register a user
// - ** POST /api/users/auth ** - Authenticate a user and get token
// - ** POST /api/users/logout ** - Logout user and clear cookie
// - ** GET /api/users/profile ** - Get user profile
// - ** PUT /api/users/profile ** - Update profile