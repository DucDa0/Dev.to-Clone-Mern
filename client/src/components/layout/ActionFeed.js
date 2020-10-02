import React from 'react';
import PropTypes from 'prop-types';

// router/redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const ActionFeed = ({ isAuthenticated, user }) => {
  return (
    <div className='action-feed'>
      {isAuthenticated ? (
        <div className='action-feed__wrap'>
          <ul className='action-feed__user'>
            <li>
              <Link
                style={{ color: 'royalblue', fontWeight: '600' }}
                className='action-feed_s'
                to='/profile/me'
              >
                {'@' + user.name}
              </Link>
            </li>
            <div className='separate'></div>
            <li>
              <Link className='action-feed_s' to='/dashboard'>
                Dash board
              </Link>
            </li>
            <li>
              <Link className='action-feed_s' to='/write-post'>
                Write a post
              </Link>
            </li>
            <li>
              <Link className='action-feed_s' to='/dashboard/reading-list'>
                Reading list
              </Link>
            </li>

            <li>
              <Link className='action-feed_s' to='/settings'>
                Setting
              </Link>
            </li>
            <div className='separate'></div>
            <li>
              <Link className='action-feed_s' to='/signout_confirm'>
                <span className='hide-sm'>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

ActionFeed.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ActionFeed);
