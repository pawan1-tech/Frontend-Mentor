const express = require("express");
const { authUser, registerUser, logoutUser, getUserProfile, updateUser } = require("../controllers/userController");

const router = express.Router();

router.post('/',registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(getUserProfile).put(updateUser);


module.exports = router;  