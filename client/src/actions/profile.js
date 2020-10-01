import api from '../utils/api';
import { toast } from 'react-toastify';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Get other user profile
export const getUserProfile = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    return toast.error(err.response.data.msg);
  }
};

// Create or update profile
export const createProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/profile', formData);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    toast.success('Profile Updated');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete account & profile
export const deleteAccount = (formData) => async (dispatch) => {
  try {
    await api.post('/profile', formData);

    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: ACCOUNT_DELETED });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};
