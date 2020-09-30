import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const Setting = ({ auth: { user }, children, checkPage }) => {
  let history = useHistory();
  return (
    <div className='setting-container container'>
      <h1 className='text-dark setting-title my-1'>
        Setting for <span style={{ color: 'royalblue' }}>@{user.name}</span>
      </h1>
      <select
        value={checkPage === '/settings/user/account' ? 'account' : 'profile'}
        onChange={(e) => {
          if (e.target.value === 'profile') {
            return history.push('/settings/user/profile');
          }
          if (e.target.value === 'account') {
            return history.push('/settings/user/account');
          }
        }}
        className='select filter-feed-select settings-select'
      >
        <option value='profile'>Profile</option>
        <option value='account'>Account</option>
      </select>
      <div className='settings my-1'>
        <div className='side-setting'>
          <Link
            style={{
              display: 'block',
              width: '100%',
              backgroundColor:
                checkPage === '/settings/user/account' ? '#eef0f1' : '#fff',
              padding: '0.5rem',
            }}
            to='/settings/user/profile'
            className='btn btn-light'
          >
            Profile
          </Link>
          <Link
            style={{
              display: 'block',
              width: '100%',
              backgroundColor:
                checkPage === '/settings/user/profile' ||
                checkPage === '/settings'
                  ? '#eef0f1'
                  : '#fff',
              padding: '0.5rem',
            }}
            to='/settings/user/account'
            className='btn btn-light'
          >
            Account
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};
Setting.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Setting);
