import React, { Fragment, useState, useEffect } from 'react';

const ActionFollow = ({ setAuth, path, handleFollow, _auth, isFollowing }) => {
  const [isFollowState, setIsFollowState] = useState(isFollowing);
  useEffect(() => {
    setIsFollowState(isFollowing);
  }, [isFollowing]);
  const handleFollowTag = () => {
    if (_auth.isAuthenticated) {
      if (isFollowState) {
        setIsFollowState(false);
        handleFollow();
      } else {
        setIsFollowState(true);
        handleFollow();
      }
    } else {
      return setAuth(true);
    }
  };
  return (
    <Fragment>
      {_auth.isAuthenticated && isFollowState ? (
        <button
          style={{ margin: path ? '0' : '20px 0' }}
          onClick={handleFollowTag}
          className='btn btn-light'
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollowTag}
          style={{
            margin: path ? '0' : '20px 0',
          }}
          className='btn btn-blue'
        >
          Follow
        </button>
      )}
    </Fragment>
  );
};

export default React.memo(ActionFollow);
