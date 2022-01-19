import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import PostMessage from '../models/postMessage.js';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quickshare56@gmail.com',
    pass: `${process.env.password}`
  }
});

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postmsg = await PostMessage.findById(id);
    res.status(200).json(postmsg);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
}

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));
  console.log(index);
  if (index === -1) {
    post.likes.push(req.userId);
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${post.email}`,
      subject: `NOTIFICATION: Someone has liked your post !`,
      html: `<h1>Hey ${post.name} ! </h1><p><h3>${req.target} has liked❤️ your post ! This post has total ${post?.likes?.length} like(s) now.Go to <a href="https://hemant-sahu.netlify.app/${post._id}">your post</a> and check what's happening there ! </h3></p>`
    };

    if (post.creator != req.userId) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${post.email}`,
      subject: `NOTIFICATION: Someone has unliked your post !`,
      html: `<h1>Hey ${post.name} ! </h1><p><h3>${req.target} has unliked💔 your post ! This post has total ${post?.likes?.length} like(s) now.Go to <a href="https://hemant-sahu.netlify.app/${post._id}">your post</a> and check what's happening there ! </h3></p>`
    };
    if (post.creator != req.userId) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  // console.log(req.target);
  try {
    const post = await PostMessage.findById(id);

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${post.email}`,
      subject: `NOTIFICATION: Someone has commented on your post !`,
      html: `<h1>Hey ${post.name} ! </h1><p><h3>${req.target} has commented on your post ! Go to <a href="https://hemant-sahu.netlify.app/${post._id}">your post</a> and check what's happening there ! </h3></p>`
    };



    post.comments.push(value);
    if (post.creator != req.userId) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
  }
  catch {
    res.status(400).json({ message: "Bad request !" });
  }
};

export default router;