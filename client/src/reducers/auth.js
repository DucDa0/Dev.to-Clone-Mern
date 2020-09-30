import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  ACCOUNT_DELETED,
  UPDATE_USER,
  USER_DELETE_POST,
  USER_ADD_POST,
  USER_EDIT_POST,
  USER_BOOKMARK,
  USER_UNBOOKMARK,
  FOLLOW,
  UNFOLLOW,
  FOLLOW_TAGS,
  UNFOLLOW_TAGS,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_USER:
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case FOLLOW_TAGS:
      const { tagId, tagName, tagColor } = payload;
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          tagCounts: state.user.tagCounts + 1,
          followingTags: [
            { _id: tagId, tagName, tagColor },
            ...state.user.followingTags,
          ],
        },
      };
    case FOLLOW:
      const { userId, userName, userAvatar } = payload;
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          followingCount: state.user.followingCount + 1,
          following: [
            { _id: userId, name: userName, avatar: userAvatar },
            ...state.user.following,
          ],
        },
      };
    case UNFOLLOW_TAGS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          tagCounts: state.user.tagCounts - 1,
          followingTags: state.user.followingTags.filter(
            (item) => item._id !== payload.tagId
          ),
        },
      };
    case UNFOLLOW:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          followingCount: state.user.followingCount - 1,
          following: state.user.following.filter(
            (item) => item._id !== payload.userId
          ),
        },
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case USER_DELETE_POST:
      return {
        ...state,
        user: {
          ...state.user,
          posts: state.user.posts.filter((post) => post._id !== payload),
          postCount: state.user.postCount - 1,
        },

        loading: false,
      };
    case USER_EDIT_POST:
      return {
        ...state,
        user: {
          ...state.user,
          posts: state.user.posts.map((item) =>
            item._id === payload._id
              ? {
                  ...item,
                  title: payload.title,
                  content: payload.content,
                  coverImage: payload.coverImage,
                }
              : item
          ),
        },
        loading: false,
      };
    case USER_ADD_POST:
      const {
        date,
        title,
        likesCount,
        bookmarksCount,
        commentsCount,
        _id,
        content,
      } = payload;
      return {
        ...state,
        user: {
          ...state.user,
          posts: [
            {
              date,
              title,
              content,
              likesCount,
              bookmarksCount,
              commentsCount,
              _id,
            },
            ...state.user.posts,
          ],
          postCount: state.user.postCount + 1,
        },
        loading: false,
      };
    case USER_BOOKMARK:
      const { name, avatar, id } = payload.data;
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          bookMarkedPostsCount: state.user.bookMarkedPostsCount + 1,
          bookMarkedPosts: [
            {
              user: {
                name,
                avatar,
              },
              _id: id,
              date: payload.data.date,
              title: payload.data.title,
            },
            ...state.user.bookMarkedPosts,
          ],
        },
      };
    case USER_UNBOOKMARK:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          bookMarkedPostsCount: state.user.bookMarkedPostsCount - 1,
          bookMarkedPosts: state.user.bookMarkedPosts.filter(
            (item) => item._id !== payload.data.id
          ),
        },
      };

    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    default:
      return state;
  }
}
