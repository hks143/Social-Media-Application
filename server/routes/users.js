import express from "express";
const router = express.Router();

import {FollowUnfollow, Mychats,SendMailToUser,FindUserForChat, GetDirectPost,directPost,signin, signup, loginUser, requestOtp, requestOtpLogin, changePassword, loginviaOTP, AddNotification, FindNotification, ClearNotification, FindUnseenNotes, SetNotesSeen } from "../controllers/user.js";
import auth from "../middleware/auth.js";

router.post("/FindUserForChat",auth,FindUserForChat);
router.post("/addNotification",auth,AddNotification)
router.post("/clearNotification",auth,ClearNotification);
router.post("/findNotification",auth,FindNotification);
router.post("/findUnseenNotes",auth,FindUnseenNotes);
router.post("/SetNotesSeen",auth,SetNotesSeen);
router.get("/Mychats",auth,Mychats);
router.post("/direct",auth,directPost);
router.post("/SendMailToUser",auth,SendMailToUser);
router.post("/GETdirect",auth,GetDirectPost);
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/loginUsers", loginUser);
router.post("/requestotp", requestOtp);
router.post("/requestotpLogin", requestOtpLogin);
router.post("/loginviaOTP", loginviaOTP);
router.patch("/changePassword", changePassword);
router.patch("/followUnfollow",auth,FollowUnfollow);

export default router;