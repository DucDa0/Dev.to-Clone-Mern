const express = require('express');
const router = express.Router();
const moment = require('moment');

const Tag = require('../../models/Tags');
const Post = require('../../models/Post');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/tags
// @desc     get tags
// @access   Public
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find({ isPopular: true }).select([
      'tagName',
      'tagColor',
      'tagDescription',
    ]);

    return res.json(tags);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/popular-tags
// @desc     get popular tags
// @access   Public
router.get('/popular-tags', async (req, res) => {
  try {
    const tags = await Tag.find({ isPopular: true })
      .limit(20)
      .select('tagName');
    return res.json(tags);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/write-tags
// @desc     get  tags for write post
// @access   Public
router.get('/write-tags', async (req, res) => {
  try {
    const tags = await Tag.find({ isPopular: true }).select('tagName');
    return res.json(tags);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/:id
// @desc     get tag by id
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).select([
      'tagName',
      'tagColor',
      'tagDescription',
    ]);
    if (!tag) {
      return res.status(404).json({ msg: 'Tag not found!' });
    }
    return res.json(tag);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/posts/:id
// @desc     get posts by tag id, latest
// @access   Public
router.get('/posts/:id', checkObjectId('id'), async (req, res) => {
  try {
    const posts = await Post.find({ tags: req.params.id })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found!' });
    }
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/posts/date/:id
// @desc     get posts by tag id, date
// @access   Public
router.get('/posts/date/:id', checkObjectId('id'), async (req, res) => {
  try {
    let today = moment().startOf('day');
    let tomorrow = moment(today).endOf('day');
    const posts = await Post.find({
      tags: req.params.id,
      date: { $gte: today.toDate(), $lt: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found!' });
    }
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/posts/month/:id
// @desc     get posts by tag id, month
// @access   Public
router.get('/posts/month/:id', checkObjectId('id'), async (req, res) => {
  try {
    let today = moment().startOf('month');
    let tomorrow = moment(today).endOf('month');
    const posts = await Post.find({
      tags: req.params.id,
      date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found!' });
    }
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET api/tags/posts/year/:id
// @desc     get posts by tag id, year
// @access   Public
router.get('/posts/year/:id', checkObjectId('id'), async (req, res) => {
  try {
    let today = moment().startOf('year');
    let tomorrow = moment(today).endOf('year');
    const posts = await Post.find({
      tags: req.params.id,
      date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
    })
      .sort({ date: -1 })
      .populate('user', ['avatar', 'name'])
      .populate('tags', ['tagName']);
    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found!' });
    }
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

//  add tags
router.post('/', async (req, res) => {
  const { tagName, tagColor, isPopular } = req.body;
  try {
    const tag = new Tag({
      tagName,
      tagColor,
      isPopular,
    });
    await tag.save();
    return res.json(tag);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
