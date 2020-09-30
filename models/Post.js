const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  title: { type: String, required: true, trim: true },
  coverImage: { type: String, trim: true },
  content: { type: String, required: true, trim: true },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
  likesCount: {
    type: Number,
    default: 0,
  },
  bookmarks: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
  bookmarksCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      reply: [
        {
          user_reply: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
          },
          toUser: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
          },
          toName: {
            type: String,
          },
          toComment: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          text_reply: {
            type: String,
            required: true,
            trim: true,
          },
          name_reply: {
            type: String,
            required: true,
          },
          avatar_reply: {
            type: String,
          },
          date_reply: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  commentsCount: {
    type: Number,
    default: 0,
  },
  tags: [{ type: mongoose.Schema.ObjectId, ref: 'tag' }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('post', PostSchema);
