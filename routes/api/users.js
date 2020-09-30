const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const config = require('config');
const { validationResult } = require('express-validator');
const normalize = require('normalize-url');
const nodemailer = require('nodemailer');
const { errorHandler } = require('../../helpers/dbErrorHandling');
const {
  validSign,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../../helpers/valid');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Notification = require('../../models/Notification');
const Post = require('../../models/Post');
const Tag = require('../../models/Tags');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', validSign, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User with this email already exists' }] });
    }

    //* generate token for active account
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      config.get('JWT_ACCOUNT_ACTIVATION'),
      {
        expiresIn: '15m',
      }
    );
    //* email sending
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get('NODEMAILER_EMAIL'),
        pass: config.get('NODEMAILER_PASS'),
      },
    });
    const content = `
              <h1>Please click this link to active your account</h1>
              <p>${config.get('CLIENT_URL')}/users/activate/${token}</p>
              <hr/>
              <p>This email contain sensetive information</p>
              <p>${config.get('CLIENT_URL')}</p>
          `;
    const mainOptions = {
      from: config.get('NODEMAILER_EMAIL'),
      to: email,
      subject: 'Account activation link',
      html: content,
    };
    transporter
      .sendMail(mainOptions)
      .then(() => {
        return res.json({
          message: `An email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          errors: [{ msg: errorHandler(err) }],
        });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route    POST api/users/activate
// @desc     Active user
// @access   Public

router.post('/activate', async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
      jwt.verify(
        token,
        config.get('JWT_ACCOUNT_ACTIVATION'),
        async (err, decoded) => {
          if (err) {
            return res.status(400).json({
              errors: [{ msg: 'Expired link. Sign Up again' }],
            });
          } else {
            const { name, email, password } = jwt.decode(token);
            const avatar = normalize(
              gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
              }),
              { forceHttps: true }
            );
            const user = new User({
              name,
              email,
              avatar,
              password,
            });
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            user.save(async (err, user) => {
              if (err) {
                return res.status(400).json({
                  errors: [{ msg: 'Already actived!' }],
                });
              } else {
                await Profile.create({
                  user: user._id,
                });
                return res.json({
                  message: 'Actived success, you can log in now',
                });
              }
            });
          }
        }
      );
    } else {
      return res.status(400).json({
        errors: [{ msg: 'Error happening please try again' }],
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route    PUT api/users/forget
// @desc     Send request for reset pwd
// @access   Public

router.put('/password/forget', forgotPasswordValidator, async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          errors: [{ msg: 'User with this email does not exist' }],
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        config.get('JWT_RESET_PASSWORD'),
        { expiresIn: '15m' }
      );

      //* email sending
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.get('NODEMAILER_EMAIL'),
          pass: config.get('NODEMAILER_PASS'),
        },
      });
      const content = `
                  <h1>Please Click to link to reset your password</h1>
                  <p>${config.get(
                    'CLIENT_URL'
                  )}/users/password/reset/${token}</p>
                  <hr/>
                  <p>This email contain sensetive information</p>
                  <p>${config.get('CLIENT_URL')}</p>
              `;
      const mainOptions = {
        from: config.get('NODEMAILER_EMAIL'),
        to: email,
        subject: 'Password reset link',
        html: content,
      };
      user.updateOne(
        {
          resetPasswordLink: token,
        },
        (err, success) => {
          if (err) {
            return res.status(400).json({
              errors: [{ msg: errorHandler(err) }],
            });
          } else {
            transporter
              .sendMail(mainOptions)
              .then(() => {
                return res.json({
                  message: `An email has been sent to ${email}`,
                });
              })
              .catch((err) => {
                return res.json({
                  errors: [{ msg: err.message }],
                });
              });
          }
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route    PUT api/users/reset
// @desc     Confirm reset pwd
// @access   Public
router.put('/password/reset', resetPasswordValidator, async (req, res) => {
  try {
    const { resetPasswordLink, newPassword } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      if (resetPasswordLink) {
        jwt.verify(
          resetPasswordLink,
          config.get('JWT_RESET_PASSWORD'),
          async function (err, decoded) {
            if (err) {
              return res.status(400).json({
                errors: [{ msg: 'Expired link. Try again' }],
              });
            }
            let user = await User.findById(decoded._id);
            if (
              !user.resetPasswordLink ||
              user.resetPasswordLink !== resetPasswordLink
            ) {
              return res.status(400).json({
                errors: [{ msg: 'Something went wrong. Try later' }],
              });
            }
            const salt = await bcrypt.genSalt(10);

            const hashPassword = await bcrypt.hash(newPassword, salt);
            const updatedFields = {
              password: hashPassword,
              resetPasswordLink: '',
            };

            user = _.extend(user, updatedFields);

            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  errors: [{ msg: 'Error resetting user password' }],
                });
              }
              return res.json({
                message: `Reset password done! You can login with your new password`,
              });
            });
          }
        );
      } else {
        return res.status(400).json({
          errors: [{ msg: 'Error happening please try again' }],
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route    PUT api/users/update
// @desc     Update user
// @access   Private
router.put('/update', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, name, password, password_old, avatar } = req.body;
  try {
    let user = await User.findById(req.user.id);
    let oldMail = user.email;
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found!' }] });
    }
    if (password_old) {
      const isMatch = await user.checkPassword(password_old);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Old password is wrong!' }] });
      }
    }

    if (!email) {
      return res.status(400).json({ errors: [{ msg: 'Email is required!' }] });
    } else {
      user.email = oldMail;
    }
    if (!name) {
      return res.status(400).json({ errors: [{ msg: 'Name is required!' }] });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          errors: [{ msg: 'Password should be min 6 characters long' }],
        });
      } else {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);
      }
    }
    if (avatar) {
      user.avatar = avatar;
    }
    user.save(async (err, updateUser) => {
      if (err) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Error updating user' }] });
      }
      if (email && email !== oldMail) {
        const findExistsEmail = await User.findOne({ email });
        if (findExistsEmail) {
          return res.status(400).json({
            errors: [
              { msg: 'User with that email exists. Try another email!' },
            ],
          });
        }
        //* generate token for active email
        const token = jwt.sign(
          {
            userId: req.user.id,
            email,
            name,
          },
          config.get('JWT_EMAIL_ACTIVATION'),
          {
            expiresIn: '15m',
          }
        );
        //* email sending
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.get('NODEMAILER_EMAIL'),
            pass: config.get('NODEMAILER_PASS'),
          },
        });
        const content = `
              <h1>Please click this link to verify your new email</h1>
              <p>${config.get('CLIENT_URL')}/users/verify-email/${token}</p>
              <hr/>
              <p>This email contain sensetive information</p>
              <p>${config.get('CLIENT_URL')}</p>
          `;
        const mainOptions = {
          from: config.get('NODEMAILER_EMAIL'),
          to: email,
          subject: 'Email verify link',
          html: content,
        };
        transporter
          .sendMail(mainOptions)
          .then(() => {
            console.log('Send mail ok!');
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              errors: [{ msg: errorHandler(err) }],
            });
          });
      }
      updateUser.password = undefined;
      return res.json(updateUser);
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/users/updateNewEmail
// @desc     Update user
// @access   Public
router.put('/updateNewEmail', async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
      jwt.verify(
        token,
        config.get('JWT_EMAIL_ACTIVATION'),
        async (err, decoded) => {
          if (err) {
            return res.status(400).json({
              errors: [{ msg: 'Expired link. Try again' }],
            });
          } else {
            const { userId, email } = decoded;
            const user = await User.findById(userId);
            if (!user) {
              return res.status(404).json({
                errors: [{ msg: 'User not exists!' }],
              });
            }
            if (email && user.email === email) {
              return res.status(400).json({
                errors: [{ msg: 'Already verified!' }],
              });
            }
            user.email = email;
            user.save(async (err, user) => {
              if (err) {
                return res.status(400).json({
                  errors: [{ msg: 'Some thing went wrong, try later!' }],
                });
              } else {
                return res.json({
                  message:
                    'Verified success, you can log in now with your new email',
                });
              }
            });
          }
        }
      );
    } else {
      return res.status(400).json({
        errors: [{ msg: 'Error happening please try again' }],
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/users/follow
// @desc     follow user
// @access   Private
router.put('/follow/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ msg: 'User not found!' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found!' });
    }
    if (req.user.id === req.params.id) {
      // a user cannot follow themselves
      return;
    }

    // i don't use findOneAndUpdate, because use array methods are more efficient in case user trigger constantly
    // like, bookmark, follow tags and comment i also use array method to update data
    let check = false;
    if (me.following.includes(req.params.id)) {
      const index = me.following.indexOf(req.params.id);
      me.following.splice(index, 1);
      me.followingCount = me.followingCount - 1;

      const index_f = user.followers.indexOf(req.user.id);
      user.followers.splice(index_f, 1);
      user.followersCount = user.followersCount - 1;
    } else {
      check = true;
      me.followingCount = me.followingCount + 1;
      me.following = [req.params.id, ...me.following];

      user.followersCount = user.followersCount + 1;
      user.followers = [req.user.id, ...user.followers];
    }

    await user.save();
    await me.save();

    res.status(200).json({
      success: true,
      data: {
        userId: req.params.id,
        userName: user.name,
        userAvatar: user.avatar,
        check,
      },
    });

    // send notifications
    if (check) {
      await Notification.create({
        me: req.params.id,
        someone: req.user.id,
        type: 'follow',
      });
    } else {
      await Notification.findOneAndDelete({
        type: 'follow',
        someone: req.user.id,
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/users/follow_tags
// @desc     follow tags
// @access   Private
router.put(
  '/follow_tags/:id',
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res.status(404).json({ msg: 'Tag not found!' });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found!' });
      }
      let check = false;
      if (user.followingTags.includes(req.params.id)) {
        const index = user.followingTags.indexOf(req.params.id);
        user.followingTags.splice(index, 1);
        user.tagCounts = user.tagCounts - 1;
      } else {
        check = true;
        user.tagCounts = user.tagCounts + 1;
        user.followingTags = [req.params.id, ...user.followingTags];
      }
      await user.save();
      return res.status(200).json({
        success: true,
        data: {
          tagId: req.params.id,
          tagName: tag.tagName,
          tagColor: tag.tagColor,
          check,
        },
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/users/get-reading-list
// @desc     get reading list
// @access   Private
router.get('/get-reading-list', auth, async (req, res) => {
  // this route is created for case others user delete account, it will update my reading list
  try {
    const user = await User.findById(req.user.id);
    let readLength = user.bookMarkedPosts.length;

    if (readLength > 0) {
      let i;
      for (i = 0; i < readLength; ++i) {
        const post = await Post.findById(user.bookMarkedPosts[i]);
        if (!post) {
          user.bookMarkedPosts.splice(i, 1);
          user.bookMarkedPostsCount = user.bookMarkedPostsCount - 1;
          await user.save();
        }
      }
    }
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
