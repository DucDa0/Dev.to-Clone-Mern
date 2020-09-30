import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';

// action
import { getPopularTags } from '../../actions/tags';

function TagRecommend({ tags, getPopularTags }) {
  useEffect(() => {
    getPopularTags();
  }, [getPopularTags]);
  return (
    <div className='tag-recommend my-1'>
      <p className='p'>Popular tags</p>
      <div className='p tag-recommend__wrap'>
        {tags.map((tag) => (
          <Link
            onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
            key={tag._id}
            className='tag-recommend__link'
            to={`/tags/${tag._id}/${tag.tagName}`}
          >
            <span
              key={tag._id}
              className='tag-recommend__item py-tags'
            >{`#${tag.tagName}`}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
TagRecommend.propTypes = {
  tags: PropTypes.array.isRequired,
  getPopularTags: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  tags: state.tags.tags_popular,
});
export default connect(mapStateToProps, { getPopularTags })(TagRecommend);
