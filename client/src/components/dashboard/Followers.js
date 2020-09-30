import React from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';
function Followers({ follower }) {
  return (
    <div className='followers__item bg-white'>
      <Link
        onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
        to={`/profile/user/${follower._id}`}
        className='followers__item-wrap'
      >
        <img
          style={{ objectFit: 'cover' }}
          className='round-img-dashboard'
          alt='alt'
          src={follower.avatar}
        />
        <div className='follower-name'>{'@' + follower.name}</div>
      </Link>
    </div>
  );
}
Followers.propTypes = {
  follower: PropTypes.object.isRequired,
};
export default React.memo(Followers);
