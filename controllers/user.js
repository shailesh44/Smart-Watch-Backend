const User = require("../models/user");
// const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.getUserloggedindetails = (req, res) => {
  req.password = undefined;
  // console.log(req);
  return res.json(req.user);
};

exports.updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const iscorrectpass = await user.autheticate(req.body.oldpassword);
    if (!iscorrectpass) {
      return res.status(400).json({
        error: "old password is incorrect",
      });
    }

    user.password = req.body.password;
    await user.save();

    //create token
    const token = user.getJwtToken();
    //put token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};
