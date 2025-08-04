const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../model/User');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route   post api/user
//@desc    register user
//@access  public
router.post(
  '/',
  [
    check('name', 'please enter name').not().isEmpty(),
    check('email', 'please enter valid email').isEmail(),
    check('password', 'please enter password with 6 or more letters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);

    const { name, email, password } = req.body;
    // console.log('Email received:', email);

    try {
      //see if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User already exists' }] });
      }
      //get user gravatar
      const avatar = gravatar.url(
        email,
        {
          s: '200',
          r: 'pg',
          d: 'mm',
        },
        true
      ); // ✅ third param ensures "https"

      //create new user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //   console.log('Gravatar URL:', avatar);
      //encrypt password
      const salt = await bcrypt.genSalt(10); //get a promise for hashing
      user.password = await bcrypt.hash(password, salt);
      await user.save(); //everything that return promise should have await
      //return json webtoken
      const payload = {//data you want to store or tokenize
        user: {
          id: user.id,
        },
      };
      // console.log('JWT Secret:', config.get('jwtsecret'));
      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });//send token bacj to user often use in authentication of login api
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
