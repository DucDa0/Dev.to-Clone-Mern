import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

// action
import { addLike, addBookmarks } from '../../actions/post';

// component
import ActionPostItem from './ActionPostItem';
import SidePostProfile from './SidePostProfile';
import TagLink from './TagLink';

// others
import Moment from 'react-moment';
import { MarkdownPreview } from 'react-marked-markdown';

const PostItem = ({
  addLike,
  addBookmarks,
  auth,
  post: {
    _id,
    title,
    coverImage,
    likes,
    bookmarks,
    tags,
    content,
    user,
    likesCount,
    bookmarksCount,
    date,
  },
  profile,
  setAuth,
}) => {
  const [likesState, setLikes] = useState(likesCount);
  const [bookmarksState, setBookMarks] = useState(bookmarksCount);

  const incLikes = () => setLikes(likesState + 1);
  const decLikes = () => setLikes(likesState - 1);
  const incBookMarks = () => setBookMarks(bookmarksState + 1);
  const decBookMarks = () => setBookMarks(bookmarksState - 1);
  useEffect(() => {
    setLikes(likesCount);
    setBookMarks(bookmarksCount);
  }, [likesCount, bookmarksCount]);
  const handleLikeAction = () => {
    if (!auth.isAuthenticated) {
      return setAuth(true);
    } else {
      addLike(_id);
      return setAuth(false);
    }
  };
  const handleBookmarksAction = () => {
    if (!auth.isAuthenticated) {
      return setAuth(true);
    } else {
      addBookmarks(_id);
      return setAuth(false);
    }
  };
  return (
    <div className='post py post-main'>
      <ActionPostItem
        handleBookmarksAction={handleBookmarksAction}
        handleLikeAction={handleLikeAction}
        likedState={!auth.user ? null : likes.includes(auth.user._id)}
        likesState={likesState}
        bookmarkedState={!auth.user ? null : bookmarks.includes(auth.user._id)}
        bookmarksState={bookmarksState}
        incLikes={incLikes}
        decLikes={decLikes}
        incBookMarks={incBookMarks}
        decBookMarks={decBookMarks}
        setAuth={setAuth}
      />
      <div className='main-post-item bg-white'>
        {coverImage && (
          <div style={{ height: '340px', display: 'block' }}>
            <img
              alt=''
              src={coverImage}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        )}
        <div className='main-post-item__article'>
          <h1
            style={{
              fontSize: '3rem',
              lineHeight: '1.2',
            }}
            className='text-dark post-item__title'
          >
            {title}
          </h1>

          <div className='tags-post_item my-1'>
            {tags.length > 0 &&
              tags.map((tag) => <TagLink tag={tag} key={tag._id} />)}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px 0',
            }}
          >
            <Link
              onClick={() => store.dispatch({ type: 'CLEAR_DATA' })}
              style={{ display: 'flex' }}
              to={`/profile/user/${user._id}`}
            >
              <img
                style={{ objectFit: 'cover' }}
                className='round-img'
                src={user.avatar}
                alt=''
              />
              <h5 style={{ marginLeft: '5px' }}>{user.name}</h5>
            </Link>
            <p
              className='post-date'
              style={{ alignSelf: 'flex-end', margin: '0' }}
            >
              Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
            </p>
          </div>
          <MarkdownPreview className='post-item' value={content} />
        </div>
      </div>

      <SidePostProfile
        auth={auth}
        user={user}
        profile={profile}
        setAuth={setAuth}
      />
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  addBookmarks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addLike,
  addBookmarks,
})(PostItem);
