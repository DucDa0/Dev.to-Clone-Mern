import React from 'react';

// router/redux
import { Link } from 'react-router-dom';
import store from '../../store';

function TagLink({ tag }) {
  return (
    <Link
      onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
      style={{
        height: '30px',
        width: 'auto',
        backgroundColor: `${tag.tagColor}`,
        color: '#fff',
        padding: '4px',
        marginRight: '8px',
        fontSize: '0.85rem',
        borderRadius: '5px',
      }}
      to={`/tags/${tag._id}/${tag.tagName}`}
    >
      {`#${tag.tagName}`}
    </Link>
  );
}

export default TagLink;
