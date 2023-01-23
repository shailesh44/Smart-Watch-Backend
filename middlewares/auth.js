var jwt = require("jsonwebtoken");
const User = require("../models/user");




exports.isLoggedIn = async(req,res,next) => {
    const token = req.cookies.token || (req.header("Authorization") 
    && req.header("Authorization").replace("Bearer ", ""));

    if (!token) {
        return next("Login first to access");
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    console.log("decoded", decoded);
    req.user = await User.findById(decoded.id)

     next(); 

}