import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import store from '../../store';

// action
import { logout } from '../../actions/auth';

const SignOut = ({ logout, history }) => {
  return (
    <div className='sign-out'>
      <h1 className='medium text-dark'>Are you sure you want to sign out?</h1>
      <button
        style={{ margin: '15px 0', fontSize: '1.2rem' }}
        onClick={() => {
          logout();
          store.dispatch({ type: 'CLEAR_PROFILE' });
          store.dispatch({ type: 'CLEAR_NOTIFCATIONS' });
          return history.push('/');
        }}
        className='btn btn-dark'
      >
        Yes. Sign out.
      </button>
    </div>
  );
};

SignOut.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(SignOut);
