import React from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';

// icons
import { Comment, ReplyComment } from '../icons/icons';

// others
import { timeSince } from '../../utils/timesince';

function CommentNotify({ data }) {
  return (
    <div
      style={{ backgroundColor: !data.isSeen ? '#f3f5ff' : '#fff' }}
      className='reaction-notify'
    >
      <div className='reaction-notify__wrap'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
          className='reaction-notify__user'
          to={`/profile/user/${data.someone._id}`}
        >
          <img
            src={data.someone.avatar}
            className='round-img reaction-notify__user-avatar'
            style={{ objectFit: 'cover' }}
            alt=''
          />
          <div className='reaction-notify__user-info'>
            <h4
              className='reaction-notify__user-name'
              style={{ color: 'royalblue' }}
            >
              {data.someone.name}
            </h4>
            <p className='reaction-notify__user-date'>{` (${timeSince(
              data.date
            )} ago)`}</p>
          </div>
        </Link>
        <div className='reaction-notify__message'>
          {data.type === 'comment' ? (
            <span>
              commented <Comment /> on
              <Link
                onClick={() => store.dispatch({ type: 'CLEAR_POST' })}
                to={`/post/${data.post._id}`}
              >{` [${data.post.title}]`}</Link>{' '}
            </span>
          ) : (
            <span>
              replied your comment <ReplyComment /> on
              <Link
                onClick={() => store.dispatch({ type: 'CLEAR_POST' })}
                to={`/post/${data.post._id}`}
              >{` [${data.post.title}]`}</Link>{' '}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
CommentNotify.propTypes = {
  data: PropTypes.object.isRequired,
};
export default CommentNotify;
