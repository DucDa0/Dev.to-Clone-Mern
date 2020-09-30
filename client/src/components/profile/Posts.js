import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// component
import PostFeed from '../posts/PostFeed';
import LoginPopUp from '../auth/LoginPopUp';

const Posts = ({ posts, profile_data }) => {
  const [auth, setAuth] = useState(false);
  return (
    <Fragment>
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}

      <div className='post feed-profile container post-profile'>
        <div className='left-side-profile__wrap'>
          <div className='left-side-profile p-1 my'>
            <div
              className='left-side-profile__skills'
              style={{ borderBottom: '1px solid #aaa' }}
            >
              <h5>Skills/languages</h5>
              <div className='my-2'>{profile_data.skills}</div>
            </div>
            <div className='left-side-profile__posts my-2'>
              <div>{posts.length} posts published</div>
            </div>
          </div>
        </div>

        <div>
          <Fragment>
            {posts.map((post) => (
              <PostFeed key={post._id} post={post} setAuth={setAuth} />
            ))}
          </Fragment>
        </div>
        <div className='right-side-profile__wrap'>
          <div className='right-side-profile p-1 my-1'></div>
        </div>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  profile_data: PropTypes.object.isRequired,
};

export default Posts;
