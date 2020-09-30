import React, { Fragment, useState, useEffect } from 'react';

const ActionFollow = ({
  setAuth,
  _user,
  handleFollow,
  auth: { isAuthenticated, user, loading },
  isFollowing,
}) => {
  const [isFollowState, setIsFollowState] = useState(isFollowing);
  useEffect(() => {
    setIsFollowState(isFollowing);
  }, [isFollowing]);
  const handleFollowUser = () => {
    if (isAuthenticated) {
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
      {loading ? null : isAuthenticated &&
        user._id === _user._id ? null : isAuthenticated && isFollowState ? (
        <button
          onClick={handleFollowUser}
          style={{
            width: '100%',
          }}
          className='btn btn-light my'
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollowUser}
          style={{
            width: '100%',
          }}
          className='btn btn-blue my'
        >
          Follow
        </button>
      )}
    </Fragment>
  );
};

export default React.memo(ActionFollow);
