import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// action
import { activateNewEmail } from '../../actions/auth';

import jwt from 'jsonwebtoken';
import { Loader } from '../loader/Loader';

const ActivateNewEmail = ({ activateNewEmail, match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    isActived: false,
    isProcessing: false,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }
  }, []);
  const { name, token, isActived, isProcessing } = formData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      isProcessing: true,
    });
    const res = await activateNewEmail({ token });
    if (res) {
      return setFormData({
        ...formData,
        isActived: true,
        isProcessing: false,
      });
    } else {
      return setFormData({
        ...formData,
        isProcessing: false,
      });
    }
  };

  return (
    <div className='login-container container'>
      <div className='login-wrap active-acc'>
        <div className='login'>
          <p className='lead'>Hi! {name}</p>
          <form className='form' onSubmit={handleSubmit}>
            <Loader size={36} loading={isProcessing} isButton={false} />
            {!isProcessing && (
              <input
                className='btn btn-blue'
                style={{
                  width: '100%',
                  textAlign: 'center',
                  height: '50px',
                  fontSize: '1.4rem',
                }}
                type='submit'
                value='Verify'
              />
            )}
          </form>
          {isActived && (
            <p className='my-1'>
              Your new email is <b>verified!</b> Let{' '}
              <Link style={{ color: 'royalblue' }} to='/login'>
                Sign In
              </Link>{' '}
              now
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ActivateNewEmail.propTypes = {
  activateNewEmail: PropTypes.func.isRequired,
};

export default connect(null, { activateNewEmail })(ActivateNewEmail);
