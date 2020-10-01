import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  UPDATE_USER,
  FOLLOW,
  UNFOLLOW,
  FOLLOW_TAGS,
  UNFOLLOW_TAGS,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
//follow user
export const follow = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/users/follow/${id}`);
    if (res.data.data.check) {
      dispatch({
        type: FOLLOW,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: UNFOLLOW,
        payload: res.data.data,
      });
    }
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
    toast.error(err.response.data.msg);
  }
};

//follow tags
export const followTags = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/users/follow_tags/${id}`);
    if (res.data.data.check) {
      dispatch({
        type: FOLLOW_TAGS,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: UNFOLLOW_TAGS,
        payload: res.data.data,
      });
    }
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
    toast.error(err.response.data.msg);
  }
};
// update user
export const updateUser = (formData) => async (dispatch) => {
  const { email } = formData;
  try {
    const res = await api.put('/users/update', formData);
    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    });
    loadUser();
    if (email !== res.data.email) {
      toast.warning(
        'You have changed your email!, an email has been sent to your new email'
      );
    }
    toast.success('Update complete!');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};
// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);
    toast.success(res.data.message);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Activate User
export const activate = (token) => async (dispatch) => {
  try {
    const res = await api.post('/users/activate', token);
    toast.success(res.data.message);
    return true;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Activate User with new email
export const activateNewEmail = (token) => async (dispatch) => {
  try {
    const res = await api.put('/users/updateNewEmail', token);
    toast.success(res.data.message);
    return true;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Forget password
export const forget = (email) => async (dispatch) => {
  try {
    const res = await api.put(`users/password/forget`, email);
    toast.success(res.data.message);
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Reset password
export const reset = (data) => async (dispatch) => {
  try {
    const res = await api.put(`users/password/reset`, data);
    toast.success(res.data.message);
    return true;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => ({ type: LOGOUT });
