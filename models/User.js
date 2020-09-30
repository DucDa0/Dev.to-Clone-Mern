const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    followingTags: [{ type: mongoose.Schema.ObjectId, ref: 'tag' }],
    tagCounts: {
      type: Number,
      default: 0,
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
    followersCount: {
      type: Number,
      default: 0,
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
    followingCount: {
      type: Number,
      default: 0,
    },
    posts: [{ type: mongoose.Schema.ObjectId, ref: 'post' }],
    postCount: {
      type: Number,
      default: 0,
    },
    bookMarkedPosts: [{ type: mongoose.Schema.ObjectId, ref: 'post' }],
    bookMarkedPostsCount: {
      type: Number,
      default: 0,
    },
    resetPasswordLink: {
      type: String,
      default: '',
    },
    deleteAccountLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', UserSchema);
