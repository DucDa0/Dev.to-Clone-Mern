import {
  GET_NOTIFICATIONS,
  CLEAR_NOTIFCATIONS,
  MARK_NOTIFCATIONS,
  NOTIFICATION_ERROR,
} from '../actions/types';

const initialState = {
  notifications: [],
  notifications_count: 0,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        notifications: payload.notify,
        notifications_count: payload.notifications_count,
      };
    case MARK_NOTIFCATIONS:
      return {
        ...state,
        loading: false,
        notifications_count: 0,
      };
    case CLEAR_NOTIFCATIONS:
      return {
        ...state,
        notifications: [],
        notifications_count: 0,
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
