const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  website: {
    type: String,
    default: '',
  },
  locations: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  skills: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  education: {
    type: String,
    default: '',
  },
  social: {
    youtube: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
  },
  brand_color: {
    type: String,
    default: '#4169e1',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
