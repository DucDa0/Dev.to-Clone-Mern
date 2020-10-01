import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Router/redux
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// action
import { forget } from '../../actions/auth';

// others
import { toast } from 'react-toastify';
import { Loader } from '../loader/Loader';

const Forget = ({ forget, auth: { isAuthenticated, loading } }) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const { email } = formData;
  const onChange = (e) => setFormData({ ...formData, email: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.token) {
      return window.location.reload(false);
    }

    if (email) {
      setIsCompleted(true);
      await forget({ email });
      setIsCompleted(false);
    } else {
      return toast.error('Please provide your email');
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return loading ? null : (
    <div className='login-container container'>
      <div className='login-wrap forget-pwd'>
        <div className='login'>
          <h1 className='text-dark'>Forget Password</h1>
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='email'
                placeholder='Email Address'
                name='email'
                value={email}
                onChange={onChange}
                required
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
                value='Confirm'
              />
            ) : (
              <Loader size={36} isButton={true} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

Forget.propTypes = {
  forget: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { forget })(Forget);
