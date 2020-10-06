import React, { useState } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

// component
import ActionFeed from './ActionFeed';
import Welcome from './Welcome';

// icons
import { Notify, Chat, Menu } from '../icons/icons';

// action
import { getNotifications } from '../../actions/notify';

// api
import api from '../../utils/api';

// others
import { toast } from 'react-toastify';
import queryString from 'query-string';

const Navbar = ({
  auth: { isAuthenticated, user, loading },
  notifications_count,
  usersCount,
}) => {
  const [guestLink, setGuestLink] = useState(false);
  return (
    <nav className='wrap-header grid'>
      <div className='top-header'>
        {guestLink && (
          <div className='header-welcome'>
            <Welcome usersCount={usersCount} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div className='logo'>
            <Link
              onClick={() => {
                if (
                  localStorage.token &&
                  api.defaults.headers.common['x-auth-token']
                ) {
                  store.dispatch(getNotifications());
                }
              }}
              to='/'
            >
              <i className='fas fa-code' />
              <span> DevCommunity</span>
            </Link>
          </div>
          <div className='header-search_bar'>
            <form action={`/dev/search`} method='GET' acceptCharset='UTF-8'>
              <input
                className='header-search_bar-input'
                type='text'
                name='q'
                defaultValue={queryString.parse(window.location.search).q}
                placeholder='Search...'
                autoComplete='off'
              />
            </form>
          </div>
        </div>

        <div className='header-link'>
          {!isAuthenticated && (
            <div
              style={
                guestLink
                  ? {
                      height: '34px',
                      width: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#eef0f1',
                    }
                  : {}
              }
              onClick={() => setGuestLink(!guestLink)}
              className='header-guest'
            >
              <Menu />
            </div>
          )}

          {loading ? null : !isAuthenticated ? (
            <div className='guest-link'>
              <Link
                style={{ color: 'royalblue' }}
                className='btn btn-light'
                to='/login'
              >
                Login
              </Link>
              <Link className='btn btn-blue' to='/register'>
                Create account
              </Link>
            </div>
          ) : (
            <div className='auth-link'>
              <Link
                className='btn btn-dark btn-nav write-post'
                to='/write-post'
              >
                Write Post
              </Link>
              <div className='nav-hover'>
                <Link
                  onClick={() =>
                    toast.dark(
                      'This feature has not been developed yet, because i"m lazy ^^ '
                    )
                  }
                  to='#!'
                >
                  <Chat />
                </Link>
              </div>
              <div style={{ position: 'relative' }} className='nav-hover'>
                <Link to='/notifications'>
                  <Notify />
                </Link>
                {notifications_count >= 99 ? (
                  <span className='notifications-status'>99</span>
                ) : notifications_count === 0 ? null : (
                  <span className='notifications-status'>
                    {notifications_count}
                  </span>
                )}
              </div>
              {!user ? null : (
                <div className='avatar-feed'>
                  <ActionFeed user={user} />
                  <div className='action-connect'></div>

                  <img
                    style={{
                      objectFit: 'cover',
                      padding: '0.1rem',
                      margin: '0.25rem',
                    }}
                    className='round-img'
                    src={user.avatar}
                    alt=''
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  notifications_count: PropTypes.number,
  usersCount: PropTypes.number,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  notifications_count: state.notify.notifications_count,
  usersCount: state.post.usersCount,
});

export default connect(mapStateToProps)(Navbar);
