import React from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';
function Followings({ following }) {
  return (
    <div className='followers__item bg-white'>
      <Link
        onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
        to={`/profile/user/${following._id}`}
        className='followers__item-wrap'
      >
        <img
          style={{ objectFit: 'cover' }}
          className='round-img-dashboard'
          alt='alt'
          src={following.avatar}
        />
        <div className='follower-name'>{'@' + following.name}</div>
      </Link>
    </div>
  );
}
Followings.propTypes = {
  following: PropTypes.object.isRequired,
};
export default React.memo(Followings);
