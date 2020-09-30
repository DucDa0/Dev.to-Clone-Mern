import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

import { followTags } from '../../actions/auth';

import ActionFollow from './ActionFollow';
import LoginPopUp from '../auth/LoginPopUp';

function TagCard({ tag, followTags, _auth }) {
  const [auth, setAuth] = useState(false);
  const handleFollow = () => {
    if (_auth.isAuthenticated) {
      followTags(tag._id);
      return setAuth(false);
    } else {
      return setAuth(true);
    }
  };
  return (
    <div
      style={{ borderTop: `15px solid  ${tag.tagColor}` }}
      className='tag-card bg-white '
    >
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}
      <div className='tag-card__wrap p-1'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
          className='tag-card__link'
          to={`/tags/${tag._id}/${tag.tagName}`}
        >
          <span className='text-dark tag-card__link-name'>{`#${tag.tagName}`}</span>
        </Link>
        <p className='tag-descriptions'>{tag.tagDescription}</p>
        <ActionFollow
          setAuth={setAuth}
          tag={tag}
          handleFollow={handleFollow}
          _auth={_auth}
          isFollowing={
            !_auth.user
              ? null
              : _auth.user.followingTags.some((item) => item._id === tag._id)
          }
        />
      </div>
    </div>
  );
}
TagCard.propTypes = {
  tag: PropTypes.object.isRequired,
  _auth: PropTypes.object.isRequired,
  followTags: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  _auth: state.auth,
});
export default connect(mapStateToProps, { followTags })(TagCard);
