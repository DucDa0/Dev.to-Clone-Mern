import React, { useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { replyComment } from '../../actions/post';

// mongodb
import mongoose from 'mongoose';

// others
import moment from 'moment';
const CommentReplyForm = ({
  setReply,
  tagName,
  toUser,
  toComment,
  postId,
  comtId,
  replyComment,
  auth,
}) => {
  const [text, setText] = useState('');
  return (
    <div className='backdrop'>
      <div className='child edit-comment close-action'>
        <form
          className='form'
          onSubmit={(e) => {
            e.preventDefault();
            replyComment(postId, comtId, {
              _id: mongoose.Types.ObjectId(),
              text,
              toUser,
              toComment,
              toName: tagName,
              name_reply: auth.user.name,
              user_reply: auth.user._id,
              avatar_reply: auth.user.avatar,
              date: moment().toISOString(),
            });
            setReply(false);
          }}
        >
          <textarea
            placeholder={'to @' + tagName}
            name='text'
            rows='8'
            cols='80'
            value={text}
            onChange={(e) => setText(e.target.value)}
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
          <button
            onClick={() => {
              setReply(false);
            }}
            className='btn btn-light btn-hover'
          >
            <i style={{ color: '#363c44' }} className='fas fa-times' />
          </button>
        </form>
      </div>
    </div>
  );
};
CommentReplyForm.propTypes = {
  tagName: PropTypes.string.isRequired,
  replyComment: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { replyComment })(CommentReplyForm);
