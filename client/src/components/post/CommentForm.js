import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { addComment } from '../../actions/post';

// mongodb
import mongoose from 'mongoose';

// others
import moment from 'moment';
const CommentForm = ({ postId, addComment, isAuth, setAuth, auth }) => {
  const [text, setText] = useState('');
  const handleForm = () => {
    if (!isAuth) {
      return setAuth(true);
    } else {
      return setAuth(false);
    }
  };

  return (
    <Fragment>
      <form
        className='form'
        onSubmit={(e) => {
          e.preventDefault();
          addComment(postId, {
            _id: mongoose.Types.ObjectId(),
            name: auth.user.name,
            avatar: auth.user.avatar,
            userId: auth.user._id,
            text,
            date: moment().toISOString(),
            reply: [],
          });
          setText('');
        }}
      >
        <p className='text-dark my'>Discussion</p>
        <textarea
          onFocus={handleForm}
          name='text'
          cols='30'
          rows='8'
          placeholder='Login to post comments'
          value={text}
          onChange={(e) => {
            if (!isAuth) {
              return setAuth(true);
            }
            setText(e.target.value);
          }}
          required
          style={{
            resize: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: '0 0 0 1px rgba(8, 9, 10, 0.1)',
            borderRadius: '5px',
            backgroundColor: '#eef0f1',
          }}
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </Fragment>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  isAuth: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  auth: state.auth,
});
export default connect(mapStateToProps, { addComment })(CommentForm);
