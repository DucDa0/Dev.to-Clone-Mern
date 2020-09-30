import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_POSTS_BY_USER,
  SET_LOADING,
  CLEAR_DATA,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: null,
  posts: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_POSTS_BY_USER:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profiles: null,
        profile: null,
        posts: [],
      };
    case CLEAR_DATA:
      return {
        ...state,
        profiles: null,
        posts: [],
      };
    default:
      return state;
  }
}
