const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Notification = require('../../models/Notification');

// @route    GET api/notify
// @desc     Get all notification
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const notify = await Notification.find({ me: req.user.id })
      .sort({ date: -1 })
      .populate('someone', ['avatar', 'name'])
      .populate('post', ['title']);
    const notifications_count = await Notification.find({
      me: req.user.id,
      isSeen: false,
    });
    return res.json({
      notify,
      notifications_count: notifications_count.length,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/notify/mark_notifications
// @desc     Mark all notification, auto mark when get in page
// @access   Private
router.put('/mark_notifications', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { me: req.user.id, isSeen: false },
      {
        isSeen: true,
      }
    );
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
