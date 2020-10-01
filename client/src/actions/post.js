import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  GET_POSTS,
  GET_DISCUSS_POSTS,
  GET_HELP_POSTS,
  GET_NEWS_POSTS,
  POST_ERROR,
  SIDE_POST_ERROR,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  EDIT_COMMENT,
  EDIT_REPLY_COMMENT,
  REPLY_COMMENT,
  REMOVE_REPLY_COMMENT,
  USER_DELETE_POST,
  USER_ADD_POST,
  USER_BOOKMARK,
  USER_UNBOOKMARK,
  GET_POSTS_BY_USER,
  USER_EDIT_POST,
} from './types';

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get dicuss posts
export const getDiscussPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts/discuss-posts');

    dispatch({
      type: GET_DISCUSS_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SIDE_POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get news posts
export const getNewsPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts/news-posts');

    dispatch({
      type: GET_NEWS_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SIDE_POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get news posts
export const getHelpPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts/help-posts');

    dispatch({
      type: GET_HELP_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SIDE_POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get edit post by id
export const getEditPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/edit/${id}`);
    return res.data;
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Get post by id
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`);
    const { post, profile } = res.data;
    dispatch({
      type: GET_POST,
      payload: { post, profile },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Get post by userid
export const getPostByUser = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/user/${id}`);

    dispatch({
      type: GET_POSTS_BY_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    await api.put(`/posts/like/${id}`);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Add book mark
export const addBookmarks = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/bookmarks/${id}`);

    if (res.data.data.check) {
      dispatch({
        type: USER_BOOKMARK,
        payload: res.data,
      });
    } else {
      dispatch({
        type: USER_UNBOOKMARK,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/posts/${id}`);

      dispatch({
        type: DELETE_POST,
        payload: id,
      });
      dispatch({
        type: USER_DELETE_POST,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
      toast.error(err.response.data.msg);
    }
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/posts', formData);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch({
      type: USER_ADD_POST,
      payload: res.data,
    });
    toast.success('Publish post complete!');
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Edit post
export const editPost = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/edit/${id}`, formData);
    dispatch({
      type: USER_EDIT_POST,
      payload: res.data,
    });
    toast.success('Edit post complete!');
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const { _id, text, name, avatar, userId, date, reply } = formData;
    dispatch({
      type: ADD_COMMENT,
      payload: {
        id: postId,
        data: { _id, text, name, avatar, user: userId, date, reply },
      },
    });
    await api.post(`/posts/comment/${postId}`, formData);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Add reply comment
export const replyComment = (postId, commentId, formData) => async (
  dispatch
) => {
  try {
    const {
      _id,
      text,
      toUser,
      toComment,
      toName,
      name_reply,
      user_reply,
      avatar_reply,
      date,
    } = formData;
    dispatch({
      type: REPLY_COMMENT,
      payload: {
        commentId,
        postId,
        data: {
          _id,
          text_reply: text,
          toUser,
          toComment,
          toName,
          name_reply,
          user_reply,
          avatar_reply,
          date_reply: date,
        },
      },
    });
    await api.post(`/posts/comment/${postId}/${commentId}`, formData);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Edit comment
export const editComment = (postId, commentId, formData) => async (
  dispatch
) => {
  try {
    const { text } = formData;
    dispatch({
      type: EDIT_COMMENT,
      payload: {
        commentId,
        data: text,
      },
    });
    await api.put(`/posts/comment/${postId}/${commentId}`, formData);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Edit reply comment
export const editReplyComment = (
  postId,
  commentId,
  comment_replyId,
  formData
) => async (dispatch) => {
  try {
    const { text } = formData;
    dispatch({
      type: EDIT_REPLY_COMMENT,
      payload: {
        commentId,
        comment_replyId,
        data: text,
      },
    });
    await api.put(
      `/posts/comment-reply/${postId}/${commentId}/${comment_replyId}`,
      formData
    );
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    toast.error(err.response.data.msg);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    dispatch({
      type: REMOVE_COMMENT,
      payload: { commentId },
    });
    await api.delete(`/posts/comment/${postId}/${commentId}`);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Delete reply comment
export const deleteReplyComment = (
  postId,
  commentId,
  comment_replyId
) => async (dispatch) => {
  try {
    dispatch({
      type: REMOVE_REPLY_COMMENT,
      payload: {
        commentId,
        comment_replyId,
      },
    });
    await api.delete(
      `/posts/comment-reply/${postId}/${commentId}/${comment_replyId}`
    );
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};
