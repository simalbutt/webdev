// backend/routes/api/post.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload'); // multer middleware
const cloudinary = require('../../config/cloudinary');

const Post = require('../../model/Postmodel');
const User = require('../../model/User');

// @route POST api/post
// @desc  Create a post (optional image or video upload)
// @access Private
router.post(
  '/',
  [auth, upload.single('media'), [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select('-password');

      let imageUrl = null;
      let imageId = null;
      let videoUrl = null;
      let videoId = null;

      if (req.file) {
        // determine resource_type by mimetype
        const isVideo = req.file.mimetype.startsWith('video');
        const uploadOptions = isVideo ? { resource_type: 'video', folder: 'posts' } : { resource_type: 'image', folder: 'posts' };

        const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

        if (isVideo) {
          videoUrl = result.secure_url;
          videoId = result.public_id;
        } else {
          imageUrl = result.secure_url;
          imageId = result.public_id;
        }

        // remove local temp file
        try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      }

      const newPost = new Post({
        text: req.body.text,
        image: imageUrl,
        imageId,
        video: videoUrl,
        videoId,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route GET api/post
// @desc  Get all posts
// @access Private
router.get('/', auth, async (_req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route GET api/post/:post_id
// @desc  Get one post
// @access Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ msg: 'post not found' });
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
    return res.status(500).send('server error');
  }
});

// @route DELETE api/post/:post_id
// @desc  Delete a post and its media in Cloudinary (if exists)
// @access Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ msg: 'post not found' });

    if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'user not authorized' });

    // Remove Cloudinary image/video if present
    const deletePromises = [];
    if (post.imageId) {
      deletePromises.push(cloudinary.uploader.destroy(post.imageId, { resource_type: 'image' }));
    }
    if (post.videoId) {
      deletePromises.push(cloudinary.uploader.destroy(post.videoId, { resource_type: 'video' }));
    }
    try { await Promise.all(deletePromises); } catch (e) { console.warn('Cloudinary deletion error', e?.message || e); }

    await post.deleteOne();
    return res.json({ msg: 'post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
    return res.status(500).send('server error');
  }
});

// Likes, Unlike, Comments routes (unchanged logic)
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }
    const removeIndex = post.likes.findIndex((like) => like.user.toString() === req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/comment/:id', [auth, [check('text', 'text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    post.comments.unshift(newComment);
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.delete('/comment/:postid/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    const comment = post.comments.find((c) => c.id === req.params.comment_id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized to delete comment' });
    post.comments = post.comments.filter((c) => c.id !== req.params.comment_id);
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
