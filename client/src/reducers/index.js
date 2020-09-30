import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import post from './post';
import tags from './tags';
import notify from './notify';
import side_posts from './side_posts';

export default combineReducers({
  auth,
  profile,
  post,
  tags,
  notify,
  side_posts,
});
