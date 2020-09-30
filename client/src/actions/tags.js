import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  GET_TAGS,
  GET_TAG,
  GET_POPULAR_TAGS,
  GET_WRITE_TAGS,
  TAGS_ERROR,
  GET_TAG_POSTS,
} from './types';

// get all tags
export const getTags = () => async (dispatch) => {
  try {
    const res = await api.get('/tags');

    dispatch({
      type: GET_TAGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TAGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// get popular tags
export const getPopularTags = () => async (dispatch) => {
  try {
    const res = await api.get('/tags/popular-tags');

    dispatch({
      type: GET_POPULAR_TAGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TAGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// get write tags
export const getWriteTags = () => async (dispatch) => {
  try {
    const res = await api.get('/tags/write-tags');

    dispatch({
      type: GET_WRITE_TAGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TAGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// get tag by id
export const getTagById = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/tags/${id}`);
    dispatch({
      type: GET_TAG,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TAGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// get posts by tag id
export const getPostsByTagId = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/tags/posts/${id}`);
    dispatch({
      type: GET_TAG_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TAGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};
