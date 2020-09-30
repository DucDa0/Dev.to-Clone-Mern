import React, { useState } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

// action
import { deleteReplyComment } from '../../actions/post';

// component
import CommentReplyForm from './CommentReplyForm';
import CommentEditReply from './CommentEditReply';
import ConfirmRemoveComt from './ConfirmRemoveComt';

// others
import Moment from 'react-moment';
import { timeSince } from '../../utils/timesince';
import { MarkdownPreview } from 'react-marked-markdown';

const CommentReplyItem = ({
  postId,
  comtId,
  replyData: {
    _id,
    text_reply,
    name_reply,
    avatar_reply,
    user_reply,
    date_reply,
    toUser,
    toName,
  },
  auth,
  deleteReplyComment,
  userId,
}) => {
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [removeComt, setRemoveComt] = useState(false);
  return (
    <div className='reply-item'>
      {edit && (
        <CommentEditReply
          comment={text_reply}
          comtId={comtId}
          postId={postId}
          setEdit={setEdit}
          replyId={_id}
        />
      )}
      {reply && (
        <CommentReplyForm
          user_reply={user_reply}
          toUser={user_reply}
          toComment={_id}
          tagName={name_reply}
          comtId={comtId}
          postId={postId}
          setReply={setReply}
        />
      )}
      {removeComt && (
        <ConfirmRemoveComt
          deleteReplyComment={deleteReplyComment}
          comtId={comtId}
          postId={postId}
          _id={_id}
          setRemoveComt={setRemoveComt}
        />
      )}
      <div className='comment-item__info'>
        <div className='comment-item__date'>
          <p className='post-date' style={{ alignSelf: 'flex-end' }}>
            <span>Posted on</span>{' '}
            <Moment format='DD/MM/YY'>{date_reply}</Moment>
          </p>
          <span
            className='post-date'
            style={{
              display: 'block',
              margin: '1rem 0 0.5rem 0.3rem',
            }}
          >{` (${timeSince(date_reply)} ago)`}</span>
        </div>
      </div>
      <div className='comment-area'>
        <div className='comment-infor'>
          {userId === user_reply && (
            <h5
              style={{
                color: 'royalblue',
                fontWeight: '700',
                marginLeft: '4px',
              }}
            >
              @Author
            </h5>
          )}
          <Link
            style={{
              display: 'flex',
              wordBreak: 'break-word',
            }}
            onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
            to={
              auth.user && auth.user._id === user_reply
                ? `/profile/me`
                : `/profile/user/${user_reply}`
            }
          >
            <img
              className='round-img'
              src={avatar_reply}
              alt=''
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <h5 className='text-dark'>{name_reply}</h5>
            {auth.isAuthenticated && auth.user._id === toUser ? (
              <span
                style={{
                  display: 'block',
                  color: '#64707d',
                  fontSize: '0.8rem',
                  marginLeft: '0.3rem',
                }}
              >
                reply to{' '}
                <b
                  style={{
                    padding: '0.2rem',
                    backgroundColor: '#eee',
                    borderRadius: '5px',
                    color: 'royalblue',
                  }}
                >
                  Me
                </b>
              </span>
            ) : (
              <span
                style={{
                  display: 'block',
                  color: '#64707d',
                  fontSize: '0.8rem',
                  marginLeft: '0.3rem',
                }}
              >
                reply to{' '}
                <span
                  style={{
                    padding: '0.2rem',
                    backgroundColor: '#eee',
                    borderRadius: '5px',
                  }}
                >{`@${toName}`}</span>
              </span>
            )}
          </Link>
        </div>
        <div className='comment-content'>
          <MarkdownPreview
            style={{ margin: '16px', wordWrap: 'break-word' }}
            value={text_reply}
          />
        </div>
        {auth.isAuthenticated && auth.user._id !== user_reply && (
          <div className='comment-area__action'>
            <div
              onClick={() => {
                setReply(true);
              }}
              className='comment-area__action-item reply'
            >
              Reply
            </div>
          </div>
        )}
        {auth.isAuthenticated && user_reply === auth.user._id && (
          <div className='comment-area__action'>
            <div
              onClick={() => {
                setReply(true);
              }}
              className='comment-area__action-item reply'
            >
              Reply
            </div>
            <div
              onClick={() => {
                setEdit(true);
              }}
              className='comment-area__action-item edit'
            >
              Edit
            </div>
            <div
              onClick={() => {
                setRemoveComt(true);
              }}
              className='comment-area__action-item delete'
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CommentReplyItem.propTypes = {
  postId: PropTypes.string.isRequired,
  replyData: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteReplyComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteReplyComment })(
  CommentReplyItem
);
