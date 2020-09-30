import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

// component
import CommentEdit from './CommentEdit';
import CommentReplyForm from './CommentReplyForm';
import CommentReplyItem from './CommentReplyItem';
import ConfirmRemoveComt from './ConfirmRemoveComt';

// action
import { deleteComment } from '../../actions/post';

// pthers
import { MarkdownPreview } from 'react-marked-markdown';
import Moment from 'react-moment';
import { timeSince } from '../../utils/timesince';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date, reply },
  auth,
  deleteComment,
  userId,
}) => {
  const [showReply, setShowReply] = useState(true);
  const [edit, setEdit] = useState(false);
  const [removeComt, setRemoveComt] = useState(false);
  const [replyState, setReplyState] = useState(false);
  return (
    <Fragment>
      {edit && (
        <CommentEdit
          comment={text}
          comtId={_id}
          postId={postId}
          setEdit={setEdit}
        />
      )}
      {replyState && (
        <CommentReplyForm
          toUser={user}
          toComment={_id}
          tagName={name}
          comtId={_id}
          postId={postId}
          setReply={setReplyState}
        />
      )}
      {removeComt && (
        <ConfirmRemoveComt
          deleteComment={deleteComment}
          postId={postId}
          _id={_id}
          setRemoveComt={setRemoveComt}
        />
      )}
      <div className='comment-item__info'>
        <div className='comment-item__date'>
          <p className='post-date' style={{ alignSelf: 'flex-end' }}>
            <span>Posted on</span> <Moment format='DD/MM/YY'>{date}</Moment>
          </p>
          <span
            className='post-date'
            style={{
              display: 'block',
              margin: '1rem 0 0.5rem 0.3rem',
            }}
          >{` (${timeSince(date)} ago)`}</span>
        </div>
      </div>
      <div className='comment-area'>
        <div className='comment-infor'>
          <Link
            onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
            style={{
              display: 'flex',
              wordBreak: 'break-word',
            }}
            to={
              auth.user && auth.user._id === user
                ? `/profile/me`
                : `/profile/user/${user}`
            }
          >
            <img
              className='round-img'
              src={avatar}
              alt=''
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <h5 className='text-dark'>{name}</h5>
            {userId === user && (
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
          </Link>
        </div>
        <div className='comment-content'>
          <MarkdownPreview
            style={{ margin: '16px', wordWrap: 'break-word' }}
            value={text}
          />
        </div>
        {auth.isAuthenticated && auth.user._id !== user && (
          <div className='comment-area__action'>
            <div
              onClick={() => {
                setReplyState(true);
              }}
              className='comment-area__action-item reply'
            >
              Reply
            </div>
          </div>
        )}
        {auth.isAuthenticated && user === auth.user._id && (
          <div className='comment-area__action'>
            <div
              onClick={() => {
                setReplyState(true);
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {reply.length > 0 && (
          <button
            onClick={() => setShowReply(!showReply)}
            type='button'
            className='btn btn-light action-comt show-reply'
          >
            {showReply ? (
              <i className='fas fa-caret-down' />
            ) : (
              <i className='fas fa-caret-up' />
            )}
          </button>
        )}
        {reply.length > 0 && !showReply && (
          <i
            style={{
              color: '#aaa',
              fontSize: '0.9rem',
            }}
          >
            replies({reply.length})
          </i>
        )}
      </div>
      {showReply && (
        <div
          style={{ marginTop: reply.length > 0 ? '-45px' : '' }}
          className='reply-area'
        >
          {reply.map((rep) => (
            <CommentReplyItem
              key={rep._id}
              replyData={rep}
              postId={postId}
              userId={userId}
              setReply={setReplyState}
              comtId={_id}
            />
          ))}
        </div>
      )}
    </Fragment>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
