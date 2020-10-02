const express = require('express');
const router = express.Router();
const checkObjectId = require('../../middleware/checkObjectId');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const moment = require('moment');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Tags = require('../../models/Tags');
const Notification = require('../../models/Notification');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { tags, coverImage } = req.body;
      let tags_saved = [];
      let tags_length = tags.length;
      if (tags_length > 4) {
        return res.status(400).json({ msg: 'You can only add up to 4 tags!' });
      }
      if (tags_length > 0) {
        let i = 0;
        for (i = 0; i < tags_length; ++i) {
          if (/^[a-zA-Z0-9]*$/.test(tags[i].text) === false) {
            return res
              .status(400)
              .json({ msg: 'Tag contains non-ASCII characters or space!' });
          }
          if (tags[i].text !== tags[i].text.toLowerCase()) {
            return res.status(400).json({ msg: 'Tag must be lower case!' });
          }
          let tags_find = await Tags.findOne({ tagName: tags[i].text });
          if (!tags_find) {
            let tag_create = await Tags.create({
              tagName: tags[i].text,
            });
            tags_saved.unshift(tag_create._id);
          } else {
            tags_saved.unshift(tags[i].id);
          }
        }
      }
      if (!coverImage) {
        coverImage =
          'https://firebasestorage.googleapis.com/v0/b/fir-gallery-c070d.appspot.com/o/rJxYnq8kydefault.jpg?alt=media&token=aa77e7a8-0741-4026-b59b-661cefeca4bd';
      }
      let post = await Post.create({
        title: req.body.title,
        coverImage: coverImage,
        content: req.body.content,
        user: req.user.id,
        tags: tags_saved,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { posts: post._id },
        $inc: { postCount: 1 },
      });
      post = await post.populate('user', ['avatar', 'name']).execPopulate();
      res.json(post);

      // notify for every users if they follow me
      const user = await User.findById(req.user.id);
      let followersLength = user.followers.length;
      if (followersLength > 0) {
        let j;
        for (j = 0; j < followersLength; ++j) {
          await Notification.create({
            type: 'post',
            post: post._id,
            me: user.followers[j],
            someone: req.user.id,
          });
        }
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts/edit/:id
// @desc     Get edited data by post id
// @access   Private
router.get('/edit/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .select(['title', 'content', 'coverImage'])
      .populate('tags', ['tagName']);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/edit/:id
// @desc     Edit  post
// @access   Private
router.put(
  '/edit/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' });
      }
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      let { title, content, coverImage, tags } = req.body;
      post.title = title;
      post.content = content;
      let tags_saved = [];
      let tags_length = tags.length;
      if (tags_length > 4) {
        return res.status(400).json({ msg: 'You can only add up to 4 tags!' });
      }
      if (tags_length > 0) {
        let i;
        for (i = 0; i < tags_length; ++i) {
          if (/^[a-zA-Z0-9]*$/.test(tags[i].text) === false) {
            return res
              .status(400)
              .json({ msg: 'Tag contains non-ASCII characters or space!' });
          }
          if (tags[i].text !== tags[i].text.toLowerCase()) {
            return res.status(400).json({ msg: 'Tag must be lower case!' });
          }
          let tags_find = await Tags.findOne({ tagName: tags[i].text });
          if (!tags_find) {
            let tag_create = await Tags.create({
              tagName: tags[i].text,
            });
            tags_saved.unshift(tag_create._id);
          } else {
            tags_saved.unshift(tags[i].id);
          }
        }
      }
      post.tags = tags_saved;
      if (coverImage) {
        post.coverImage = coverImage;
      }
      await post.save();

      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts(lastest)
// @access   Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    const usersCount = await User.estimatedDocumentCount();
    return res.json({ posts, usersCount });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts
// @desc     Get  posts by date
// @access   Public
router.get('/date', async (req, res) => {
  try {
    let today = moment().startOf('day');
    let tomorrow = moment(today).endOf('day');
    const posts = await Post.find({
      date: { $gte: today.toDate(), $lt: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    const usersCount = await User.estimatedDocumentCount();
    return res.json({ posts, usersCount });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts
// @desc     Get  posts by month
// @access   Public
router.get('/month', async (req, res) => {
  try {
    let today = moment().startOf('month');
    let tomorrow = moment(today).endOf('month');
    const posts = await Post.find({
      date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    const usersCount = await User.estimatedDocumentCount();
    return res.json({ posts, usersCount });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts
// @desc     Get  posts by year
// @access   Public
router.get('/year', async (req, res) => {
  try {
    let today = moment().startOf('year');
    let tomorrow = moment(today).endOf('year');
    const posts = await Post.find({
      date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    const usersCount = await User.estimatedDocumentCount();
    return res.json({ posts, usersCount });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/discuss-posts
// @desc     Get discuss posts by tag
// @access   Public
router.get('/discuss-posts', async (req, res) => {
  try {
    const posts = await Post.find({ tags: '5f6f2988468cdd24307fee86' })
      .sort({ date: -1 })
      .select(['title', 'commentsCount'])
      .limit(5);
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/news-posts
// @desc     Get news posts by tag
// @access   Public
router.get('/news-posts', async (req, res) => {
  try {
    const posts = await Post.find({ tags: '5f6f2a0e468cdd24307fee93' })
      .sort({ date: -1 })
      .select(['title', 'commentsCount'])
      .limit(5);
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/help-posts
// @desc     Get news posts by tag
// @access   Public
router.get('/help-posts', async (req, res) => {
  try {
    const posts = await Post.find({ tags: '5f6f2a04468cdd24307fee92' })
      .sort({ date: -1 })
      .select(['title', 'commentsCount'])
      .limit(5);
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by post id
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName', 'tagColor']);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    // get user info for side post
    const profile = await Profile.findOne({
      user: post.user.id,
    }).select([
      'bio',
      'title',
      'locations',
      'date',
      'id',
      'user',
      'brand_color',
    ]);

    if (!profile) {
      return res.status(404).json({ msg: 'User not found!' });
    }

    return res.json({ post, profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/user/:id
// @desc     Get posts by userId
// @access   Public
router.get('/user/:id', checkObjectId('id'), async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    if (!posts) {
      return res.status(404).json({ msg: 'Post not found!' });
    }

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { posts: req.params.id },
      $inc: { postCount: -1 },
    });
    await post.remove();

    // delete all bookmarked from others users if they bookmark my post
    const user = await User.find({ bookMarkedPosts: req.params.id });
    let i;
    let userLength = user.length;
    if (userLength > 0) {
      for (i = 0; i < userLength; ++i) {
        const index = user[i].bookMarkedPosts.indexOf(req.params.id);
        user[i].bookMarkedPosts.splice(index, 1);
        user[i].bookMarkedPostsCount = user[i].bookMarkedPostsCount - 1;
        await user[i].save();
      }
    }
    res.status(200).json({ success: true, data: {} });

    // delete all notifications on others users if they interact to the post
    await Notification.deleteMany({
      post: req.params.id,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    let check = false; // check user like or unlike
    if (post.likes.includes(req.user.id)) {
      const index = post.likes.indexOf(req.user.id);
      post.likes.splice(index, 1);
      post.likesCount = post.likesCount - 1;
    } else {
      check = true;
      post.likesCount = post.likesCount + 1;
      post.likes = [req.user.id, ...post.likes];
    }
    await post.save();
    res.status(200).json({ success: true, data: {} });

    if (req.user.id === post.user.toString()) {
      // if user own the post, do not notify
      return;
    }
    // notify for owner post if user like, if unlike, do not notify and delete this notifications
    // if user like and bookmark post, just notify once
    if (check) {
      const checkBookMark = await Notification.findOne({
        someone: req.user.id,
        post: post._id,
        type: 'bookmark',
      });
      if (checkBookMark) {
        await Notification.findOneAndDelete({
          type: 'bookmark',
          someone: req.user.id,
          post: post._id,
        });
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'like_bookmark',
        });
      } else {
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'like',
        });
      }
    } else {
      const checkLikeBookMark = await Notification.findOne({
        someone: req.user.id,
        post: post._id,
        type: 'like_bookmark',
      });
      if (checkLikeBookMark) {
        await Notification.findOneAndDelete({
          someone: req.user.id,
          post: post._id,
          type: 'like_bookmark',
        });
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'bookmark',
          isSeen: true,
        });
      } else {
        await Notification.findOneAndDelete({
          type: 'like',
          someone: req.user.id,
          post: post._id,
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/bookmarks/:id
// @desc     Bookmarks
// @access   Private
router.put('/bookmarks/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', [
      'name',
      'avatar',
    ]);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found!' });
    }
    let check = false;
    if (post.bookmarks.includes(req.user.id)) {
      const index = post.bookmarks.indexOf(req.user.id);
      post.bookmarks.splice(index, 1);
      post.bookmarksCount = post.bookmarksCount - 1;
    } else {
      check = true;
      post.bookmarksCount = post.bookmarksCount + 1;
      post.bookmarks = [req.user.id, ...post.bookmarks];
    }

    // add or remove post to reading lists of user
    if (user.bookMarkedPosts.includes(req.params.id)) {
      const index = user.bookMarkedPosts.indexOf(req.params.id);
      user.bookMarkedPosts.splice(index, 1);
      user.bookMarkedPostsCount = user.bookMarkedPostsCount - 1;
    } else {
      check = true;
      user.bookMarkedPostsCount = user.bookMarkedPostsCount + 1;
      user.bookMarkedPosts = [req.params.id, ...user.bookMarkedPosts];
    }
    await post.save();
    await user.save();
    res.json({
      data: {
        // add this data to Reading list in dashboard if user bookmark a post
        name: post.user.name,
        avatar: post.user.avatar,
        id: req.params.id,
        date: post.date,
        title: post.title,
        check: check,
      },
    });

    if (req.user.id === post.user._id.toString()) {
      return;
    }

    if (check) {
      const checkLike = await Notification.findOne({
        someone: req.user.id,
        post: post._id,
        type: 'like',
      });
      if (checkLike) {
        await Notification.findOneAndDelete({
          type: 'like',
          someone: req.user.id,
          post: post._id,
        });
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'like_bookmark',
        });
      } else {
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'bookmark',
        });
      }
    } else {
      const checkLikeBookMark = await Notification.findOne({
        someone: req.user.id,
        post: post._id,
        type: 'like_bookmark',
      });
      if (checkLikeBookMark) {
        await Notification.findOneAndDelete({
          someone: req.user.id,
          post: post._id,
          type: 'like_bookmark',
        });
        await Notification.create({
          me: post.user,
          someone: req.user.id,
          post: post._id,
          type: 'like',
          isSeen: true,
        });
      } else {
        await Notification.findOneAndDelete({
          type: 'bookmark',
          someone: req.user.id,
          post: post._id,
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found!' });
      }
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not fonud!' });
      }
      const { _id, text, name, avatar, userId, date } = req.body;
      const newComment = {
        _id,
        text,
        name,
        avatar,
        user: userId,
        date,
      };
      post.comments = [...post.comments, newComment];
      post.commentsCount = post.commentsCount + 1;

      await post.save();
      res.status(200).json({ success: true, data: {} });

      if (req.user.id === post.user.toString()) {
        // if user own the post, do not notify
        return;
      }
      // notify for owner post if others users comments on post
      await Notification.create({
        me: post.user,
        someone: req.user.id,
        post: post._id,
        comment: newComment._id,
        type: 'comment',
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/posts/comment/:id/:coment_id
// @desc     Reply on a comment
// @access   Private
router.post(
  '/comment/:id/:comment_id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' });
      }
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found!' });
      }
      let commentsLength = post.comments.length;
      let i;
      let getComments = {};
      let check = false;
      for (i = 0; i < commentsLength; ++i) {
        if (post.comments[i].id === req.params.comment_id) {
          getComments = post.comments[i];
          check = true;
          break;
        }
      }
      if (!check) {
        return res.status(404).json({ msg: 'Comment does not exist!' });
      }
      const {
        _id,
        text,
        toUser,
        toComment,
        avatar_reply,
        toName,
        name_reply,
        user_reply,
        date,
      } = req.body;
      const newComment = {
        _id,
        text_reply: text,
        name_reply,
        avatar_reply,
        user_reply,
        toUser,
        toComment,
        toName,
        date,
      };
      getComments.reply = [...getComments.reply, newComment];
      post.commentsCount = post.commentsCount + 1;
      await post.save();
      res.status(200).json({ success: true, data: {} });
      if (req.user.id === req.body.toUser) {
        return;
      }
      await Notification.create({
        me: req.body.toUser,
        someone: req.user.id,
        post: post._id,
        comment: req.params.comment_id,
        reply_comment: newComment._id,
        to_comment: toComment,
        type: 'reply_comment',
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' });
    }
    // Pull out comment
    let check = false;
    let i;
    let postLength = post.comments.length;
    for (i = 0; i < postLength; ++i) {
      if (post.comments[i].id === req.params.comment_id) {
        if (post.comments[i].user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }
        if (post.comments[i].reply.length > 0) {
          post.commentsCount =
            post.commentsCount - 1 - post.comments[i].reply.length;
        } else {
          post.commentsCount = post.commentsCount - 1;
        }
        post.comments.splice(i, 1);
        check = true;
        break;
      }
    }
    if (!check) {
      return res.status(404).json({ msg: 'Comment does not exist!' });
    }

    await post.save();

    res.status(200).json({ success: true, data: {} });

    await Notification.deleteMany({
      // delete all notificattions about this comment
      comment: req.params.comment_id,
      post: post._id,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/comment-reply/:id/:comment_reply_id
// @desc     Delete reply comment
// @access   Private
router.delete(
  '/comment-reply/:id/:comment_id/:comment_reply_id',
  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' });
      }
      let check = false;
      let i;
      let j;
      let postLength = post.comments.length;
      let toComment;
      let toUser;
      for (i = 0; i < postLength; ++i) {
        if (post.comments[i].id === req.params.comment_id) {
          let subComtLength = post.comments[i].reply.length;

          for (j = 0; j < subComtLength; ++j) {
            if (post.comments[i].reply[j].id === req.params.comment_reply_id) {
              if (
                post.comments[i].reply[j].user_reply.toString() !== req.user.id
              ) {
                return res.status(401).json({ msg: 'User not authorized' });
              }
              toUser = post.comments[i].reply[j].toUser;
              toComment = post.comments[i].reply[j].toComment;
              post.commentsCount = post.commentsCount - 1;
              post.comments[i].reply.splice(j, 1);
              check = true;
              break;
            }
          }
        }
      }

      if (!check) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      await post.save();
      res.status(200).json({ success: true, data: {} });
      if (req.user.id === toUser.toString()) {
        return;
      }
      await Notification.findOneAndDelete({
        type: 'reply_comment',
        me: toUser,
        comment: req.params.comment_id,
        reply_comment: req.params.comment_reply_id,
        to_comment: toComment,
        post: post._id,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/posts/comment/:id/:comment_id
// @desc     EDIT comment
// @access   Private
router.put(
  '/comment/:id/:comment_id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' });
      }
      const { text } = req.body;
      let check = false;
      let i;
      let postLength = post.comments.length;
      for (i = 0; i < postLength; ++i) {
        if (post.comments[i].id === req.params.comment_id) {
          if (post.comments[i].user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
          }
          post.comments[i].text = text;
          check = true;
          break;
        }
      }
      if (!check) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      await post.save();

      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/posts/comment/:id/:comment_id
// @desc     EDIT reply comment
// @access   Private

router.put(
  '/comment-reply/:id/:comment_id/:comment_reply_id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' });
      }
      const { text } = req.body;
      let check = false;
      let i;
      let j;
      let postLength = post.comments.length;
      for (i = 0; i < postLength; ++i) {
        if (post.comments[i].id === req.params.comment_id) {
          let subComtsLength = post.comments[i].reply.length;
          for (j = 0; j < subComtsLength; ++j) {
            if (post.comments[i].reply[j].id === req.params.comment_reply_id) {
              if (
                post.comments[i].reply[j].user_reply.toString() !== req.user.id
              ) {
                return res.status(401).json({ msg: 'User not authorized' });
              }
              post.comments[i].reply[j].text_reply = text;
              check = true;
              break;
            }
          }
        }
      }
      if (!check) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      await post.save();

      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// @route    GET api/posts/dev/search
// @desc     Search data
// @access   Public
router.get('/dev/search', async (req, res) => {
  try {
    let q = req.query.q;
    const regex = new RegExp(q, 'i');
    const posts = await Post.find({
      $or: [{ title: regex }, { content: regex }],
    })
      .populate('user', ['name', 'avatar'])
      .select(['title', 'content', 'date']);
    const comments = await Post.find({ 'comments.text': regex })
      .populate('user', ['name', 'avatar'])
      .select(['title', 'content', 'date']);
    const users = await User.find({ name: regex }).select([
      'avatar',
      'name',
      'createdAt',
    ]);
    res.status(200).json({ posts, users, comments });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
