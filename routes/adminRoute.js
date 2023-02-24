const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const router = express.Router();
const userModel = require("../models/userModel");

router.get("/get-all-users", authmiddleware, async (req, res) => {
  try {
    const users = await userModel.find({ isAdmin: false });
    res.status(200).send({
      message: "users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error applying users list", success: false, error });
  }
});

router.post("/change-user-status", authmiddleware, async (req, res) => {
  try {
    const temp = req.body
    const id =  temp.record._id;

    const userdata = await userModel.find({_id : id },{isAdmin: false});
    const user = userdata[0]
    console.log("inside admin route",user.isActive)

    if (user.isActive) {
      user.isActive = false;
    } else {
      user.isActive = true;
    }
    await user.save();
    const allUsers = await userModel.find({ isAdmin: false });
    res.status(200).send({
      message: `user ${user.isActive ? 'Unblocked' : 'Blocked'} successfully`,
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error applying users list", success: false, error });
  }
});

module.exports = router;
