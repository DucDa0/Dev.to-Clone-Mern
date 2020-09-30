import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import store from '../../store';

// component
import PostItem from './PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import LoginPopUp from '../auth/LoginPopUp';
import ActionFollow from './ActionFollow';

// action
import { follow } from '../../actions/auth';
import { getPost } from '../../actions/post';

// others
import Moment from 'react-moment';
import { Loader } from '../loader/Loader';
import { Link } from 'react-router-dom';

const Post = ({
  getPost,
  post: { post, loading, profile },
  match,
  _auth,
  follow,
}) => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  const handleFollow = () => {
    if (_auth.isAuthenticated) {
      follow(post.user._id);
      return setAuth(false);
    } else {
      return setAuth(true);
    }
  };
  return loading || !post ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div className='post-item-container container'>
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}
      <PostItem post={post} profile={profile} setAuth={setAuth} />
      <div className='post post-user'>
        <div className='post-user__left-side'></div>
        <div className='post-user__info bg-white my'>
          <div className='post-user__image'>
            <Link
              onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
              to={`/profile/user/${post.user._id}`}
            >
              {' '}
              <img
                alt=''
                src={post.user.avatar}
                className='post-user__avatar round-img'
              />
            </Link>

            <h5 style={{ color: 'royalblue' }}>@Author</h5>
          </div>
          <div className='post-user__desc'>
            <h1>{post.user.name}</h1>
            <div className='post-date'>
              Joined at <Moment format='DD/MM/YYYY'>{profile.date}</Moment>
            </div>
            <p style={{ color: '#475760' }}>{profile.bio}</p>
            <ActionFollow
              _user={post.user}
              setAuth={setAuth}
              handleFollow={handleFollow}
              auth={_auth}
              isFollowing={
                !_auth.user
                  ? null
                  : _auth.user.following.some(
                      (item) => item._id === post.user._id
                    )
              }
            />
          </div>
        </div>
        <div className='post-user__right-side'></div>
      </div>
      <div className='post post-comment py'>
        <div className='post-comment__left-side'></div>

        <div className='bg-white comment-item'>
          <CommentForm setAuth={setAuth} postId={post._id} />
          <p className='text-dark my'>Comments ({post.commentsCount})</p>

          {post.comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={post._id}
              userId={post.user._id}
            />
          ))}
        </div>
        <div className='post-comment__right-side'></div>
      </div>
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  profile: PropTypes.object,
  auth: PropTypes.object,
  follow: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  profile: state.profile.profile,
  _auth: state.auth,
});

export default connect(mapStateToProps, { getPost, follow })(Post);
