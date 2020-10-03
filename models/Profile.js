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
    trim: true,
    default: '',
  },
  locations: {
    type: String,
    trim: true,
    default: '',
  },
  title: {
    type: String,
    trim: true,
    default: '',
  },
  skills: {
    type: String,
    trim: true,
    default: '',
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  education: {
    type: String,
    trim: true,
    default: '',
  },
  social: {
    youtube: {
      type: String,
      trim: true,
      default: '',
    },
    twitter: {
      type: String,
      trim: true,
      default: '',
    },
    facebook: {
      type: String,
      trim: true,
      default: '',
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    instagram: {
      type: String,
      trim: true,
      default: '',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
  },
  brand_color: {
    type: String,
    trim: true,
    default: '#4169e1',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
