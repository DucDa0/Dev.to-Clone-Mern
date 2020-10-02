import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// icons
import { BookMarkFeed, UnBookMarkFeed } from '../icons/icons';

const ActionPostFeed = ({
  auth,
  isBookMarked,
  setAuth,
  handleBookmarksAction,
  incBookMarks,
  decBookMarks,
}) => {
  const [bookMarkedState, setbookMarkedState] = useState(isBookMarked);

  useEffect(() => {
    setbookMarkedState(isBookMarked);
  }, [isBookMarked]);
  const handleBookMark = () => {
    if (auth.isAuthenticated) {
      if (bookMarkedState) {
        setbookMarkedState(false);
        decBookMarks();
        handleBookmarksAction();
      } else {
        setbookMarkedState(true);
        incBookMarks();
        handleBookmarksAction();
      }
    } else {
      return setAuth(true);
    }
  };
  return (
    <div className='read-action'>
      <button
        onClick={handleBookMark}
        style={{
          marginRight: 0,
          padding: '0.5rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className='btn btn-light btn-hover'
      >
        {auth.isAuthenticated && bookMarkedState ? (
          <UnBookMarkFeed />
        ) : (
          <BookMarkFeed />
        )}
      </button>
    </div>
  );
};
ActionPostFeed.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ActionPostFeed);
