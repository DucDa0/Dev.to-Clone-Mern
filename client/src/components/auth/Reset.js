import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Router/redux
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// action
import { reset } from '../../actions/auth';

// others
import { toast } from 'react-toastify';

const Reset = ({ reset, match, auth: { isAuthenticated, loading } }) => {
  const [formData, setFormData] = useState({
    password1: '',
    password2: '',
    token: '',
    isCompleted: false,
  });

  const { password1, password2, token, isCompleted } = formData;
  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.token) {
      return window.location.reload(false);
    }
    if (password1 && password2) {
      if (password1 === password2) {
        const res = await reset({
          newPassword: password1,
          resetPasswordLink: token,
        });
        if (res) {
          return setFormData({
            ...formData,
            isCompleted: true,
          });
        } else {
        }
      } else {
        return toast.error("Passwords don't matches");
      }
    } else {
      return toast.error('Type your new password to confirm!');
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return loading ? null : (
    <div className='login-container container'>
      <div className='login-wrap reset-pwd'>
        <div className='login'>
          <h1 className='text-dark'>Reset Password</h1>
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password1'
                value={password1}
                onChange={onChange}
                minLength='6'
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Confirm Password'
                name='password2'
                value={password2}
                onChange={onChange}
                minLength='6'
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>
            <input
              type='submit'
              className='btn btn-blue'
              style={{
                width: '100%',
                textAlign: 'center',
                height: '50px',
              }}
              value='Confirm'
            />
          </form>
          {isCompleted && (
            <p className='my-1'>
              Reset password complete!,{' '}
              <Link style={{ color: 'royalblue' }} to='/login'>
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

Reset.propTypes = {
  reset: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { reset })(Reset);
