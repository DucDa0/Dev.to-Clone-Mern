import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Router/redux
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// action
import { register } from '../../actions/auth';

// others
import { toast } from 'react-toastify';
import { Loader } from '../loader/Loader';

const Register = ({ register, auth: { isAuthenticated, loading } }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [isCompleted, setIsComplete] = useState(false);
  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.token) {
      return window.location.reload(false);
    }

    if (name && email && password) {
      if (password !== password2) {
        return toast.error('Passwords do not match');
      } else {
        setIsComplete(true);
        await register({ name, email, password });
        setIsComplete(false);
      }
    } else {
      return toast.error('Please fill all fields');
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }
  return loading ? null : (
    <div className='login-container container'>
      <div className='login-wrap sign-up'>
        <div className='login'>
          <h1 className='text-dark'>Welcome to Dev!</h1>
          <h1 className='text-dark'>Sign up</h1>
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                onChange={onChange}
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>
            <div className='form-group'>
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={email}
                onChange={onChange}
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
                placeholder='Password'
                name='password'
                value={password}
                onChange={onChange}
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
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>

            {!isCompleted ? (
              <input
                type='submit'
                className='btn btn-blue'
                style={{
                  width: '100%',
                  textAlign: 'center',
                  height: '50px',
                }}
                value='Register'
              />
            ) : (
              <Loader size={36} isButton={true} />
            )}
          </form>
          <p className='my-1'>
            Already have an account?{' '}
            <Link to='/login' style={{ color: 'royalblue' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { register })(Register);
