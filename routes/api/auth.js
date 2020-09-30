const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

const User = require('../../models/User');
const { validLogin } = require('../../helpers/valid');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select(['-password', '-resetPasswordLink', '-deleteAccountLink'])
      .populate({
        path: 'posts',
        select: [
          'title',
          'coverImage',
          'content',
          'likesCount',
          'bookmarksCount',
          'date',
          'commentsCount',
        ],
        options: { sort: { date: -1 } },
      })
      .populate({
        path: 'bookMarkedPosts',
        select: ['title', 'date'],
        populate: { path: 'user', select: ['name', 'avatar'] },
      })
      .populate('followers', ['avatar', 'name'])
      .populate('following', ['avatar', 'name'])
      .populate('followingTags', ['tagName', 'tagColor']);
    if (!user) {
      return res.status(404).json({ msg: 'User not found!' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', validLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('JWT_SECRET'),
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
