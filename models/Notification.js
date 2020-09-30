const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotifySchema = new Schema({
  me: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  someone: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'post',
    default: null,
    index: true,
  },
  comment: {
    type: mongoose.Schema.ObjectId,
    default: null,
    index: true,
  },
  reply_comment: {
    type: mongoose.Schema.ObjectId,
    default: null,
    index: true,
  },
  to_comment: {
    type: mongoose.Schema.ObjectId,
    default: null,
    index: true,
  },
  type: {
    type: String,
    enum: [
      'like',
      'bookmark',
      'like_bookmark',
      'comment',
      'reply_comment',
      'follow',
      'post',
    ],
    required: true,
    index: true,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('notification', NotifySchema);
