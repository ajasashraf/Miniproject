const express = require("express");
const { models } = require("mongoose");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("../middlewares/authmiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
    console.log("user =>", userExist);
    if (userExist) {
      return res
        .status(200)
        .send({ message: "user already exist!", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({ message: "user created", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating on user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user doesn't exist", success: false });
    }
    if (!user.isActive) {
      return res
        .status(200)
        .send({ message: "Blocked by Admin", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successfull", success: true, token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleWare, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user doesnot exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          image: user.image
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post('/update-profile',authMiddleWare,async(req,res)=>{
  try {
      const updateImage=req.body.imageUpdate
      console.log(updateImage);
      const user=await userModel.findOne({_id:req.body.userId})

      if(!user){
          return res.status(200).send({message:"User does not exist",success:false})
      }else{
          user.image=updateImage
          await user.save()
          res.status(200).send({message:"update profile successfully",success:true})
      }

  } catch (error) {
      res.status(500).send({
          message:"Error getting user-info",success:false,error
      })
  }
})
module.exports = router;
