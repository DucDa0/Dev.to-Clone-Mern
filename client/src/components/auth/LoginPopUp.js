import React from 'react';
import PropTypes from 'prop-types';

// Router
import { Link } from 'react-router-dom';

const LoginPopUp = ({ setAuth }) => {
  return (
    <div className='backdrop'>
      <div className='child close-action'>
        <button
          onClick={() => {
            setAuth(false);
            document.body.style.overflow = '';
          }}
          style={{ position: 'absolute', right: 0, top: 0, margin: '8px' }}
          className='btn btn-light btn-hover '
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h1 style={{ padding: '20px 0' }} className='text-dark'>
          Log in to continue
        </h1>
        <p style={{ textAlign: 'center' }}>
          We're a place where coders share, stay up-to-date and grow their
          careers.
        </p>

        <Link
          style={{
            width: '100%',
            textAlign: 'center',
            margin: '20px 0 0 0',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className='btn btn-blue'
          to='/login'
        >
          <i style={{ fontSize: '1.6rem' }} className='fas fa-sign-in-alt'></i>
        </Link>

        <p className='my-1'>
          Don't have an account?{' '}
          <Link to='/register' style={{ color: 'royalblue' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
LoginPopUp.propTypes = {
  setAuth: PropTypes.func.isRequired,
};
export default LoginPopUp;
