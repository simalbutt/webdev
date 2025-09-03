const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
//@route   get api/auth
//@desc    test route
//@access  public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}); //by adding auth it become protected
//@route   post api/auth
//@desc    authanticate user
//@access  public
router.post(
  '/',
  [
    check('email', 'please enter valid email').isEmail(),
    check('password', 'please enter password ').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);

    const { email, password } = req.body;
    // console.log('Email received:', email);

    try {
      //see if user exist
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User does not exist' }] });
      }

      //check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid password' }] });
      }

      //return json webtoken
      const payload = {
        //data you want to store or tokenize
        user: {
          id: user.id,
        },
      };
      //   console.log('JWT Secret:', config.get('jwtsecret'));
      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //send token back to user often use in authentication of login api
        }
      );

      // res.send('user register ');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);
module.exports = router;
