const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
  getUserloggedindetails,
  updatePassword,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { isLoggedIn } = require("../middlewares/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get("/getUserloggedindetails", isLoggedIn, getUserloggedindetails);
router.post("/updatePassword", isLoggedIn, updatePassword);
router.put("/updateUser", isLoggedIn, updateUser);

module.exports = router;

