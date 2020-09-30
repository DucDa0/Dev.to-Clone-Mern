import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import store from '../../store';

import { timeSince } from '../../utils/timesince';

function People({ data }) {
  return (
    <div className='reaction-notify bg-white'>
      <div className='reaction-notify__wrap people'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
          className='reaction-notify__user'
          to={`/profile/user/${data._id}`}
        >
          <img
            src={data.avatar}
            className='round-img reaction-notify__user-avatar'
            style={{ objectFit: 'cover' }}
            alt=''
          />
          <div className='reaction-notify__user-info'>
            <h4
              className='reaction-notify__user-name'
              style={{ color: 'royalblue' }}
            >
              {data.name}
            </h4>
            <p className='reaction-notify__user-date'>{` join at (${timeSince(
              data.createdAt
            )} ago)`}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
People.propTypes = {
  data: PropTypes.object.isRequired,
};
export default People;
