import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';

// icons
import { ReadingLists, DashBoard, Settings, Sign, Tags } from '../icons/icons';

// others
import Moment from 'react-moment';

function UserFeedSide({ _auth: { loading, isAuthenticated, user } }) {
  return (
    <div className='user-feed-side'>
      {loading ? null : isAuthenticated ? (
        <Fragment>
          {!user ? null : (
            <div className='side-item'>
              <Link
                to='/profile/me'
                onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
                className='user-feed__info'
              >
                <img
                  alt=''
                  style={{ objectFit: 'cover', marginRight: '5px' }}
                  className='round-img-feed'
                  src={user.avatar}
                />
                <div>
                  <span className='text-dark' style={{ fontWeight: '600' }}>
                    {`${user.name}`}{' '}
                  </span>
                  <p className='post-date'>
                    <span>Joined </span>
                    <Moment format='DD/MM/YYYY'>{user.createdAt}</Moment>
                  </p>
                </div>
              </Link>
            </div>
          )}
          <div className='side-item'>
            <Link className='user-feed__info' to='/dashboard'>
              <DashBoard />
              <span style={{ marginLeft: '8px' }}>Dashboard</span>
            </Link>
          </div>
          <div className='side-item'>
            <Link className='user-feed__info' to='/dashboard/reading-list'>
              <ReadingLists />
              <span style={{ marginLeft: '8px' }}>Reading list</span>
            </Link>
          </div>
          <div className='side-item'>
            <Link
              className='user-feed__info'
              style={{ marginBottom: '0 ' }}
              to='/settings'
            >
              <Settings />
              <span style={{ marginLeft: '8px' }}>Settings</span>
            </Link>
          </div>
          <div className='side-item'>
            <Link
              className='user-feed__info'
              style={{ marginBottom: '0 ' }}
              to='/tags'
            >
              <Tags />
              <span style={{ marginLeft: '8px' }}>Tags</span>
            </Link>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className='side-item'>
            <Link
              className='user-feed__info'
              style={{ marginBottom: '0 ' }}
              to='/login'
            >
              <Sign />
              <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                Sign In/Up
              </span>
            </Link>
          </div>
          <div className='side-item'>
            <Link
              className='user-feed__info'
              style={{ marginBottom: '0 ' }}
              to='/tags'
            >
              <Tags />
              <span style={{ marginLeft: '8px' }}>Tags</span>
            </Link>
          </div>
        </Fragment>
      )}
    </div>
  );
}
UserFeedSide.propTypes = {
  _auth: PropTypes.object.isRequired,
};
export default UserFeedSide;
