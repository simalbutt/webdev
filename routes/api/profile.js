const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../model/Profile');
const User = require('../../model/User');
const Post = require('../../model/Postmodel');

//@route   get api/profile/me
//@desc    get current users profile
//@access  private
router.get('/me', auth, async (req, res) => {
  try {
    // console.log('User ID:', req.user.id);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) return res.status(400).json({ msg: 'profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route   post api/profile
//@desc   create and update profile
//@access  private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Please add a status').not().isEmpty(),
      check('skills', 'Please add skills').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      // experience,
      githubusername,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    //try to get user profile
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update existing user profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        //create new user profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      }
    } catch (err) {
      console.erro(err.message);
      res.status(500).send('server error ');
    }

    console.log(profileFields.skills);
    res.send('hello');
  }
);
//@route   get api/profile
//@desc   get all profiles
//@access  public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server1 error ');
  }
});
//@route   get api/profile
//@desc   get  profiles by id
//@access
router.get('/user/:user_id', async (req, res) => {
  try {
    // console.log('User ID param:', req.params.user_id);
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // Catch malformed ObjectId error
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('server1 error ');
  }
});

//@route   delete api/profile
//@desc   delete profile/user /post
//@access  private
router.delete('/', auth, async (req, res) => {
  try {
    //remove posts
    await Post.deleteMany({ user: req.user.id });
    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    //remove user
    await User.findByIdAndDelete({ _id: req.user.id });
    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server1 error ');
  }
});
// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error('Error in PUT /experience:', err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route   delete api/profile/experience
//@desc   delete  profile experience
//@access  private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex != -1) {
      profile.experience.splice(removeIndex, 1);
      await profile.save();
      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//@route   PUT api/profile/education
//@desc    Add profile education
//@access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('to', 'To date must be after From date')
        .optional()
        .custom((value, { req }) => !value || new Date(value) > new Date(req.body.from)),
    ],
  ],
  async (req, res) => {
    //  console.log('Request Body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldOfStudy, from, to, current, description } = req.body;

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route   delete api/profile/education
//@desc   delete  profile education
//@access  private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (removeIndex != -1) {
      profile.education.splice(removeIndex, 1);
      await profile.save();
      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
//@route  get api/profile/github/:username
//@desc   get user repo by username
//@access  public

router.get('/github/:username', async (req, res) => {
  try {
    const uri = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`;

    const options = {
      uri,
      method: 'GET',
      headers: {
        'User-Agent': 'node.js',
      },
    };

    request(options, (err, response, body) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching GitHub repos');
      }

      if (response.statusCode === 200) {
        return res.json(JSON.parse(body));
      } else {
        return res
          .status(response.statusCode)
          .json({ msg: 'GitHub profile not found' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
