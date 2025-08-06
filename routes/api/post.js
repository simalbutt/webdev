const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../model/Postmodel');
const User = require('../../model/User');
const Profile = require('../../model/Profile');

//@route   post api/post
//@desc    create the post
//@access  private
router.post(
  '/',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password'); //don't want to send password back F
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }
  }
);

//@route   get api/post
//@desc    get all post
//@access  private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //get most oldest  first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//@route   get api/post/:id
//@desc    get one post
//@access  private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//@route   delete api/post/:id
//@desc    delete a  post
//@access  private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: ' user not authorized' });
    }
    await post.deleteOne();
    res.json({ msg: 'post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//@route   put api/post/like/:id
//@desc    like a  post
//@access  private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    //check if user already like teh post or not
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id }); //add on the beginning
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//@route   PUT api/post/unlike/:post_id
//@desc    Unlike a post
//@access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check if the post has been liked by this user
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }

    // Remove like
    const removeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   post api/post/comment/:id
//@desc    add comment to the post
//@access  private
router.post(
  '/comment/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password'); //don't want to send password back F
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }
  }
);

//@route   delete api/post/comment/:postid/comment_id
//@desc    delete comment to the post
//@access  private
router.delete(
  '/comment/:postid/:comment_id',
  [auth, check('comment_id', 'Please enter a comment id').not().isEmpty()],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postid);
      //pull out the comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      //make sure comments exist
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      //check if user owns comment
      if (comment.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ msg: 'Not authorized to delete comment' });
      }
      //remove comment
    const removeIndex = post.comments.findIndex(
      (comment) => comment.user.toString() === req.user.id
    );
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }
  }
);

module.exports = router;
