import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import store from '../../store';

import { timeSince } from '../../utils/timesince';

function SearchItem({ data }) {
  return (
    <div className='reaction-notify bg-white'>
      <div className='reaction-notify__wrap'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
          className='reaction-notify__user'
          to={`/profile/user/${data.user._id}`}
        >
          <img
            src={data.user.avatar}
            className='round-img reaction-notify__user-avatar'
            style={{ objectFit: 'cover' }}
            alt=''
          />
          <div className='reaction-notify__user-info'>
            <h4
              className='reaction-notify__user-name'
              style={{ color: 'royalblue' }}
            >
              {data.user.name}
            </h4>
            <p className='reaction-notify__user-date'>{` (${timeSince(
              data.date
            )} ago)`}</p>
          </div>
        </Link>
        <div className='reaction-notify__message'>
          <span>
            <Link
              onClick={() => store.dispatch({ type: 'CLEAR_POST' })}
              to={`/post/${data._id}`}
            >{` [${data.title}]`}</Link>{' '}
          </span>
        </div>
      </div>
    </div>
  );
}
SearchItem.propTypes = {
  data: PropTypes.object.isRequired,
};
export default SearchItem;
