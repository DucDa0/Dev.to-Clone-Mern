import {
  GET_DISCUSS_POSTS,
  GET_NEWS_POSTS,
  GET_HELP_POSTS,
  SIDE_POST_ERROR,
} from '../actions/types.js';

const initialState = {
  loading: true,
  discuss_posts: [],
  help_posts: [],
  news_posts: [],
  error: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_DISCUSS_POSTS:
      return {
        ...state,
        discuss_posts: payload,
        loading: false,
      };
    case GET_HELP_POSTS:
      return {
        ...state,
        help_posts: payload,
        loading: false,
      };
    case GET_NEWS_POSTS:
      return {
        ...state,
        news_posts: payload,
        loading: false,
      };
    case SIDE_POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
