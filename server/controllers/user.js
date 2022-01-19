import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator'
import UserModal from "../models/user.js";
import LoginModal from "../models/loginUsers.js"
import nodemailer from 'nodemailer';
import Message from '../models/message.js'
import user from "../models/user.js";
import PostMessage from "../models/postMessage.js"
import Notification from "../models/notification.js";

const secret = `${process.env.secret_key}`;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {

    user: 'quickshare56@gmail.com',
    pass: `${process.env.password}`

  }
});

export const requestOtp = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(op);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `QuickShare Email Verification`,
      html: `<p>Hi,</p> <p> Your OTP for verifying email on QuickShare is ${op}.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        res.status(200).send(op);
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    res.status(401).send('Something went wrong');
  }


}
export const signin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // console.log(oldUser.password,password,email);
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

      res.status(200).json({ result: oldUser, token });
    }
    else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });


    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${email}`,
      subject: `Welcome To QuickShare`,
      html: `<p>Hi ${firstName},</p> <p> Thank you for registering on QuickShare.Create memories and start sharing on QuickShare.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    const id = result._id;
    await LoginModal.create({ id, firstname: firstName, lastname: lastName, email, when: Date.now() });
    res.status(201).json({ result, token });


  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  // console.log(req.body);
  const id = req.body.googleId;
  const email = req.body.email;
  const firstname = req.body.givenName;
  const lastname = req.body.familyName;
  const ind = await LoginModal.findOne({ email: req.body.email }).exec();
  // console.log(ind);
  if (!ind) {

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${email}`,
      subject: `Welcome To QuickShare`,
      html: `<p>Hi ${firstname} ${lastname},</p> <p> QuickShare warmly welcomes you.Create memories and start sharing on QuickShare.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    try {
      await LoginModal.create({ id, firstname, lastname, email, when: Date.now() });
      res.status(201);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });

      console.log(error);
    }
  }
  else {
    res.status(201);
  }

};

export const requestOtpLogin = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(req);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    // console.log(oldUser);
    if (!oldUser) return res.status(400).json({ message: "User doesn't exist" });

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `QuickShare Change Password`,
      html: `<p>Hi ${oldUser.name},</p> <p> Your OTP for changing password on QuickShare is ${op}.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        res.status(200).send(op);
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    res.status(401).send('Something went wrong');
  }
}

export const loginviaOTP = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(req);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    // console.log(oldUser);
    if (!oldUser) return res.status(401).json({ message: "User doesn't exist" });

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `Login Via OTP`,
      html: `<p>Hi ${oldUser.name},</p> <p>${op} is your QuickShare verification code.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        res.status(200).json({ token, OneTimePassword: op, UserResult: oldUser });
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    console.log("error= ", error);
    res.status(401).send('Something went wrong');
  }
}

export const changePassword = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const oldUser = await UserModal.findOne({ email });
    // console.log(oldUser);
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const pass = await bcrypt.hash(password, 12);
    // console.log(password);
    const updatedUser = { email: oldUser.email, name: oldUser.name, password: pass }
    const newUser = await UserModal.findByIdAndUpdate(oldUser._id, updatedUser, { new: true });
    //  console.log(newUser);

    res.status(200).json(newUser);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const directPost = async (req, res) => {
  const data = req.body;
  // console.log(data);
  const newMessage = new Message({ ...data, createdAt: new Date().toISOString() })

  try {
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
}

export const GetDirectPost = async (req, res) => {
  const data = req.body.conversationId;
  // console.log(req.body);

  try {


    await Message.updateMany({ seen: false, conversationId: data, sender: { $ne: req.body.senderId } }, { $set: { seen: true } }, { new: true });
    const Messages = await Message.find({ conversationId: data }).exec();

    // console.log(Messages);
    res.status(201).json(Messages);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
}

export const FindUserForChat = async (req, res) => {
  const { id } = req.body;
  // console.log(req.body);
  try {
    const User = await LoginModal.findOne({ id });
    const post = await PostMessage.find({ creator: id });
    if (!User) return res.status(400).json({ message: "User doesn't exists" });

    res.status(201).json({ name: `${User.firstname} ${User.lastname}`, email: `${User.email}`, JoinedOn: User.when, follower: User?.follower, following: User?.following, post: post });

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });

  }
};

export const SendMailToUser = async (req, res) => {
  const id = req.body.id;
  const Name = req.body.Name;
  const msg = req.body.message;
  const senderId = req.body.senderId;
  // console.log(req.body);
  try {

    const User = await LoginModal.findOne({ id });

    if (!User) return res.status(400).json({ message: "User doesn't exists" });

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${User?.email}`,
      subject: `Someone sent you a message`,
      html: `<p>Hi ${User.firstname} ${User.lastname},</p> <p>${Name} sent you a message "${msg}". Click <a href="https://hemant-sahu.netlify.app/direct/${senderId}">here</a> for more details.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const Mychats = async (req, res) => {

  try {
    const User = await LoginModal.find();

    if (!User) return res.status(400).json({ message: "User doesn't exists" });

    res.status(201).json(User);


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const AddNotification = async (req, res) => {
  const id = req.body.id;
  const data = req.body.data;
  const seen = req.body.seen
  const newNote = new Notification({ id, notification: data, seen, createdAt: Date.now() })
  try {

    await newNote.save();
    res.status(200).json(newNote);


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const FindNotification = async (req, res) => {
  const id = req.body.id;

  try {

    const newNote = await Notification.find({ id })
    res.status(201).json(newNote);


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const ClearNotification = async (req, res) => {
  const id = req.body.id;
  try {
    const newNote = await Notification.deleteMany({ id });
    res.status(201).json(newNote);


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const FindUnseenNotes = async (req, res) => {
  const id = req.body.id;
  try {
    const newNote = await Notification.find({ id, seen: false });
    res.status(201).json(newNote);


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const SetNotesSeen = async (req, res) => {
  const id = req.body.id;
  try {
    await Notification.updateMany({ seen: false, id: id }, { $set: { seen: true } }, { new: true });
    res.status(201).json({ msg: "ok" });


  } catch (error) {

    res.status(401).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const FollowUnfollow = async (req, res) => {
  const { Follower, FollowedBy } = req.body;

  try {
    const FollowerUser = await LoginModal.find({ id: Follower });
    const FollowedByUser = await LoginModal.find({ id: FollowedBy });

    if (!FollowerUser || (!FollowedByUser)) {
      res.status(401).json({ error: "User doesn't exist" });
    }

    const index = FollowerUser[0].following.findIndex((id) => id === String(FollowedBy));

    if (index === -1) {
      FollowerUser[0].following.push(FollowedBy);
      FollowedByUser[0].follower.push(Follower);

      try{
        var mailOptions = {
          from: 'QuickShare <quickshare56@gmail.com>',
          to: `${FollowedByUser[0].email}`,
          subject: `Someone Started Following You`,
          html: `<p>Hi ${FollowedByUser[0].firstname} ${FollowedByUser[0].lastname},</p> <p>${FollowerUser[0].firstname} ${FollowerUser[0].lastname} started following you. Check your <a href="https://hemant-sahu.netlify.app/profile/${FollowedBy}">profile</a> for more details.</p>`
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
      catch(error){
        console.log(error);
      }

    }
    else {
      FollowerUser[0].following = FollowerUser[0].following.filter((id) => id !== FollowedBy);
      FollowedByUser[0].follower = FollowedByUser[0].follower.filter((id) => id !== Follower);
    }

    const updatedFollower = await LoginModal.findByIdAndUpdate(FollowerUser[0]._id, FollowerUser[0], { new: true })
    const updatedFollowing = await LoginModal.findByIdAndUpdate(FollowedByUser[0]._id, FollowedByUser[0], { new: true })
    // console.log(updatedFollower,updatedFollowing);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Somothing went wrong" });
  }
};















