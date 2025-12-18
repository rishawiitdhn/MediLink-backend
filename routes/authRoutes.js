const express = require("express");
const { register, login, getuserProfile, updateUserProfile, deleteUserProfile } = require("../controllers/authController");
const router = express.Router({mergeParams: true});

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:role/:userId", getuserProfile);
router.patch("/profile/update/:role/:userId", updateUserProfile);
router.delete("/profile/delete/:role/:userId", deleteUserProfile);


module.exports = router;