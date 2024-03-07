const express = require("express");
const { authUser, registerUser, logoutUser, getUserProfile, updateUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect,updateUser);


module.exports = router;  