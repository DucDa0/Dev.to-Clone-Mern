import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Router/redux
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// action
import { activate } from '../../actions/auth';

// others
import jwt from 'jsonwebtoken';
import { Loader } from '../loader/Loader';

const Activate = ({ activate, match, auth: { isAuthenticated, loading } }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
  });
  const [isActived, setIsActived] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }
  }, []);
  const { name, token } = formData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.token) {
      return window.location.reload(false);
    }

    setIsProcessing(true);
    const res = await activate({ token });
    if (res) {
      setIsActived(true);
    }
    setIsProcessing(false);
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return loading ? null : (
    <div className='login-container container'>
      <div className='login-wrap active-acc'>
        <div className='login'>
          <p className='lead'>Welcome {name}</p>
          <form className='form' onSubmit={handleSubmit}>
            {!isProcessing ? (
              <input
                className='btn btn-blue'
                style={{
                  width: '100%',
                  textAlign: 'center',
                  height: '50px',
                  fontSize: '1.4rem',
                }}
                type='submit'
                value='Active'
              />
            ) : (
              <Loader size={36} isButton={true} />
            )}
          </form>
          {isActived && (
            <p className='my-1'>
              Your account is <b>actived!</b> Let{' '}
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

Activate.propTypes = {
  activate: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { activate })(Activate);
