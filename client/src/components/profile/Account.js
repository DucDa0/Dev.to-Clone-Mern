import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { deleteAccount } from '../../actions/profile';
import { loadUser, updateUser } from '../../actions/auth';

// component
import Setting from './Setting';
import { ProgressBar } from '../post_editor/ProgressBar';

// api
import api from '../../utils/api';

// others
import { toast } from 'react-toastify';
import { Loader } from '../loader/Loader';
import imageCompression from 'browser-image-compression';
import Compressor from 'compressorjs';

const initialState = {
  email: '',
  name: '',
  password1: '',
  password2: '',
  password_old: '',
};

const Account = ({
  auth: { user, loading },
  location,
  loadUser,
  updateUser,
}) => {
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isCompleted, setComplete] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [imageUrl, setImageUpdateUser] = useState('');
  const { name, email, password1, password2, password_old } = formData;
  useEffect(() => {
    if (!user) loadUser();
    if (!loading && user) {
      const userData = { ...initialState };
      for (const key in user) {
        if (key in userData) userData[key] = user[key];
      }
      setFormData(userData);
    }
  }, [loading, loadUser, user]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const changeHandler = async (e) => {
    let selected = e.target.files[0];
    if (selected) {
      let file_size = selected.size;
      if (parseInt(file_size) > 2097152) {
        return toast.error('Image size must be < 2 mb');
      }
    }
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 300,
      useWebWorker: true,
    };
    if (selected && types.includes(selected.type)) {
      try {
        const compressedFile = await imageCompression(selected, options);
        new Compressor(compressedFile, {
          quality: 0.6,
          success(result) {
            setFile(result);
            setError('');
          },
          error(err) {
            console.log(err.message);
          },
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setFile(null);
      setError('Plz select an image file (png or jpeg/jpg)');
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, name, password1, password2, password_old } = formData;
    if (password1 && password2 && !password_old) {
      return toast.error('Old password is required!');
    }
    if (password1 !== password2) {
      return toast.error('Password does not match!');
    }
    if (imageUrl && imageUrl.length > 0) {
      const avt = imageUrl;
      setComplete(true);
      const res = await updateUser({
        email,
        name,
        password: password1,
        password_old: password_old,
        avatar: avt,
      });
      if (res) {
        return setComplete(false);
      } else {
        return setComplete(false);
      }
    } else {
      setComplete(true);
      const res = await updateUser({
        email,
        name,
        password: password1,
        password_old: password_old,
      });
      if (res) {
        return setComplete(false);
      } else {
        return setComplete(false);
      }
    }
  };
  const handleDeleteAccount = async () => {
    setIsDelete(true);
    try {
      const res = await api.put('/profile/delete_account_request');
      toast.success(res.data.message);
      setIsDelete(false);
    } catch (err) {
      setIsDelete(false);
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => toast.error(error.msg));
      }
    }
  };
  return (
    <Setting checkPage={location.pathname}>
      {loading || !user ? (
        <Loader size={46} isButton={false} />
      ) : (
        <div className='main-setting'>
          <div className='main-setting__dashboard  bg-white'>
            <form className='form' onSubmit={onSubmit}>
              <label htmlFor='email'>Email</label>
              <div className='form-group form-fix'>
                <input
                  type='email'
                  name='email'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={email}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='name'>Name</label>
              <div className='form-group form-fix'>
                <input
                  type='text'
                  name='name'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={name}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='avatar'>Avatar</label>
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                className='form-group form-fix'
              >
                <img
                  style={{ objectFit: 'cover' }}
                  alt=''
                  src={user.avatar}
                  className='round-img'
                />
                <input
                  accept='image/*'
                  className='btn btn-light'
                  type='file'
                  name='avatar'
                  style={{
                    borderRadius: '5px',
                    height: '40px',
                    backgroundColor: '#f9fafa',
                    marginLeft: '20px',
                  }}
                  onChange={changeHandler}
                />
              </div>
              <div style={{ width: '100%' }} className='output'>
                {error && <div className='error'>{error}</div>}
                {file && <div>{file.name}</div>}
                {file && (
                  <ProgressBar
                    file={file}
                    setFile={setFile}
                    setImageUpdateUser={setImageUpdateUser}
                  />
                )}
              </div>
              <label htmlFor='password_old'>Old password</label>
              <div className='form-group form-fix'>
                <input
                  type='password'
                  name='password_old'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={password_old}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='password1'>Password</label>
              <div className='form-group form-fix'>
                <input
                  type='password'
                  name='password1'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={password1}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='password2'>Re-password</label>
              <div className='form-group form-fix'>
                <input
                  type='password'
                  name='password2'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={password2}
                  onChange={onChange}
                />
              </div>
              <Loader size={36} isButton={true} loading={isCompleted} />
              {!isCompleted && (
                <input
                  type='submit'
                  value='Save'
                  className='btn btn-dark my-1'
                />
              )}
            </form>
          </div>
          <div
            style={{ marginTop: '20px' }}
            className='main-setting__dashboard  bg-white'
          >
            <h1 className='text-danger'>Danger Zone</h1>
            <p style={{ margin: '8px 0' }} className='text-dark'>
              <b>Delete account</b>
            </p>
            <p>Deleting your account will:</p>
            <ul>
              <li>
                delete your profile, along with your authentication
                associations. This does not include applications permissions.
              </li>
              <li>
                delete any and all content you have, such as articles, comments,
                your reading list or chat messages.
              </li>
              <li>allow your username to become available to anyone.</li>
            </ul>
            <div className='my-1'>
              <Loader size={36} isButton={true} loading={isDelete} />

              {!isDelete && (
                <button
                  className='btn btn-danger'
                  onClick={handleDeleteAccount}
                >
                  <i className='fas fa-user-minus' /> Delete My Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Setting>
  );
};

Account.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteAccount,
  loadUser,
  updateUser,
})(Account);
