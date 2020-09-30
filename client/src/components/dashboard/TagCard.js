import React from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';

// others
import { Loader } from '../loader/Loader';
function TagCard({ tag }) {
  return !tag ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div
      style={{ borderTop: `8px solid  ${tag.tagColor}` }}
      className='followers__item  bg-white'
    >
      <Link
        onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
        to={`/tags/${tag._id}/${tag.tagName}`}
        className='followers__item-wrap'
      >
        <div className='follower-name tag'>{`#${tag.tagName}`}</div>
      </Link>
    </div>
  );
}
TagCard.propTypes = {
  tag: PropTypes.object.isRequired,
};
export default React.memo(TagCard);
