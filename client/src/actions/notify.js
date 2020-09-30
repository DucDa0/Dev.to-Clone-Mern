import api from '../utils/api';
import {
  GET_NOTIFICATIONS,
  NOTIFICATION_ERROR,
  MARK_NOTIFCATIONS,
} from './types';

// get all notifications
export const getNotifications = () => async (dispatch) => {
  try {
    const res = await api.get('/notify');
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// mark all notifications
export const markNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: MARK_NOTIFCATIONS });
    await api.put('/notify/mark_notifications');
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
