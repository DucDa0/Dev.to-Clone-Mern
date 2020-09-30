import React, { Fragment, useState, useEffect } from 'react';

const ActionFollow = ({ setAuth, handleFollow, auth, isFollowing }) => {
  const [isFollowState, setIsFollowState] = useState(isFollowing);
  useEffect(() => {
    setIsFollowState(isFollowing);
  }, [isFollowing]);
  const handleFollowUser = () => {
    if (auth.isAuthenticated) {
      if (isFollowState) {
        setIsFollowState(false);
        handleFollow();
      } else {
        setIsFollowState(true);
        handleFollow();
      }
    } else {
      document.body.style.overflow = 'hidden';
      return setAuth(true);
    }
  };
  return (
    <Fragment>
      {auth.isAuthenticated && isFollowState ? (
        <button
          onClick={handleFollowUser}
          style={{
            marginRight: 0,
          }}
          className='btn btn-light'
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollowUser}
          style={{
            marginRight: 0,
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
