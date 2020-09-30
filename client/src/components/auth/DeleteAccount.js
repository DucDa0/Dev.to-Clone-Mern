import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Router.redux
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// action
import { deleteAccount } from '../../actions/profile';

// others
import { toast } from 'react-toastify';

const DeleteAccount = ({
  deleteAccount,
  match,
  auth: { isAuthenticated, loading },
}) => {
  const [formData, setFormData] = useState({
    password_confirm: '',
    confirm_string: '',
    token: '',
  });

  useEffect(() => {
    let token = match.params.token;

    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);
  const { password_confirm, token, confirm_string } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return toast.error('Some thing went wrong!');
    }
    if (!password_confirm) {
      return toast.error('Password is required!');
    }
    if (!confirm_string) {
      return toast.error('Verify string is required!');
    }
    if (confirm_string !== 'delete my account') {
      return toast.error('Verify string is incorrect!');
    }
    const res = await deleteAccount({
      deleteAccountLink: token,
      password_confirm,
      confirm_string,
    });
    if (res) {
      toast.dark('Your account has been permanently deleted!');
      return <Redirect to='/login' />;
    }
  };

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return loading ? null : (
    <div className='login-container container'>
      <div className='login-wrap'>
        <div className='login'>
          <form className='form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password_confirm'
                value={password_confirm}
                onChange={onChange}
                minLength='6'
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>
            <label htmlFor='password_confirm'>
              Type <b>delete my account</b> to confirm
            </label>

            <div className='form-group '>
              <input
                type='text'
                name='confirm_string'
                value={confirm_string}
                onChange={onChange}
                style={{
                  borderRadius: '5px',
                  height: '50px',
                  backgroundColor: '#f9fafa',
                }}
              />
            </div>
            <input
              className='btn btn-dark my-1'
              style={{
                width: '100%',
                textAlign: 'center',
                height: '50px',
                fontSize: '1.4rem',
              }}
              type='submit'
              value='Delete my account'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

DeleteAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteAccount })(DeleteAccount);
