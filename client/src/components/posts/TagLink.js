import React from 'react';
import { Link } from 'react-router-dom';
import store from '../../store';

function TagLink({ tag }) {
  return (
    <Link
      onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
      className='tags-item'
      to={`/tags/${tag._id}/${tag.tagName}`}
    >
      <span>{`#${tag.tagName}`}</span>
    </Link>
  );
}

export default TagLink;
