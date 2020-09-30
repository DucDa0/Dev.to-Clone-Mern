import React from 'react';

const ConfirmRemoveComt = ({
  setRemoveComt,
  deleteComment,
  deleteReplyComment,
  postId,
  _id,
  comtId,
}) => {
  return (
    <div className='backdrop'>
      <div className='child remove-comt close-action'>
        <button
          onClick={() => {
            setRemoveComt(false);
          }}
          style={{ position: 'absolute', right: 0, top: 0, margin: '8px' }}
          className='btn btn-light btn-hover '
        >
          <i style={{ color: '#363c44' }} className='fas fa-times' />
        </button>
        <h2 className='text-dark'>Are your sure?</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (deleteComment) {
                deleteComment(postId, _id);
              }
              if (deleteReplyComment) {
                deleteReplyComment(postId, comtId, _id);
              }
              setRemoveComt(false);
            }}
            className='btn btn-dark m-1'
          >
            Yes
          </button>
          <button
            onClick={() => {
              setRemoveComt(false);
            }}
            className='btn btn-light m-1'
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveComt;
