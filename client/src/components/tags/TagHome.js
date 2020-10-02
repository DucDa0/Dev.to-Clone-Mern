import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { getTagById } from '../../actions/tags';
import { followTags } from '../../actions/auth';

import ActionFollow from './ActionFollow';
import LoginPopUp from '../auth/LoginPopUp';
import Posts from './Posts';

import { Loader } from '../loader/Loader';
function TagHome({
  match,
  tag: { tag, loading },
  getTagById,
  followTags,
  location,
  _auth,
}) {
  const [auth, setAuth] = useState(false);
  const handleFollow = () => {
    if (_auth.isAuthenticated) {
      followTags(tag._id);
      return setAuth(false);
    } else {
      return setAuth(true);
    }
  };
  useEffect(() => {
    getTagById(match.params.id);
  }, [getTagById, match.params.id]);
  return loading || !tag ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div className='tag-home-container container'>
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}
      <div className='tag-home my-1'>
        <div
          style={{
            boxShadow: `3px 5px 1px 1px ${tag.tagColor}`,
            border: `2px solid ${tag.tagColor}`,
          }}
          className='tag-home__header'
        >
          <h1 className='x-large text-dark tag-home__title'>{`#${tag.tagName}`}</h1>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px',
            }}
          >
            <ActionFollow
              path={location.pathname}
              setAuth={setAuth}
              handleFollow={handleFollow}
              _auth={_auth}
              isFollowing={
                !_auth.user
                  ? null
                  : _auth.user.followingTags.some(
                      (item) => item._id === tag._id
                    )
              }
            />
          </div>
        </div>

        <Posts tagId={match.params.id} />
      </div>
    </div>
  );
}
TagHome.propTypes = {
  tag: PropTypes.object.isRequired,
  getTagById: PropTypes.func.isRequired,
  _auth: PropTypes.object.isRequired,
  followTags: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tag: state.tags,
  _auth: state.auth,
});
export default connect(mapStateToProps, {
  getTagById,
  followTags,
})(TagHome);
