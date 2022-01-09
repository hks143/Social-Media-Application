import express from 'express';

import { getPosts, getPostById, createPost, commentPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', auth, createPost);
router.post('/:id/commentPost', auth, commentPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;