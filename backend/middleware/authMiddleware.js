const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");


const protect = asyncHandler ( async(req, res, next) => {
    
    try {
        let token;
    
        token = req.cookies.jwt;
    
        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
                req.user = await User.findById(decoded.userId).select('-password');
    
                next();  
            } catch (error) {
                res.status(401);
                throw new Error('Not authorized, invalid token');
            } 
    
        }else {
            res.status(401);
            throw new Error('Not authorized, no token');
        }

    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
 });



module.exports = protect;