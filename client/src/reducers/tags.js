import {
  GET_TAGS,
  GET_TAG,
  GET_POPULAR_TAGS,
  GET_TAG_POSTS,
  GET_WRITE_TAGS,
  TAGS_ERROR,
  CLEAR_TAG,
} from '../actions/types';

const initialState = {
  tags: [],
  tags_write: [],
  tags_popular: [],
  tag: null,
  posts: [],
  loading: true,
  error: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TAG:
      return {
        ...state,
        loading: false,
        tag: payload,
      };
    case GET_TAG_POSTS:
      return {
        ...state,
        loading: false,
        posts: payload,
      };
    case GET_TAGS:
      return {
        ...state,
        loading: false,
        tags: payload,
      };
    case GET_POPULAR_TAGS:
      return {
        ...state,
        loading: false,
        tags_popular: payload,
      };
    case GET_WRITE_TAGS:
      return {
        ...state,
        loading: false,
        tags_write: payload,
      };
    case CLEAR_TAG:
      return {
        ...state,
        tag: null,
        posts: [],
      };
    case TAGS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        posts: [],
        tag: null,
        tags: [],
        tags_write: [],
        tags_popular: [],
      };
    default:
      return state;
  }
}
