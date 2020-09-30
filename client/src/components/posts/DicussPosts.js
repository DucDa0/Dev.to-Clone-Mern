import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../../store';

// action
import { getDiscussPosts } from '../../actions/post';

function DicussPosts({ discuss_posts, getDiscussPosts }) {
  useEffect(() => {
    getDiscussPosts();
  }, [getDiscussPosts]);
  return (
    <div className='post-side'>
      <div className='post-side__wrap'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
          to='/tags/5f6f2988468cdd24307fee86/discuss'
          className='text-dark post-side__title p'
        >
          <span>#discuss</span>
        </Link>
        <div className='post-side__content'>
          {discuss_posts.map((post) => (
            <Link
              onClick={() => store.dispatch({ type: 'CLEAR_POST' })}
              key={post._id}
              to={`/post/${post._id}`}
              className='post-side__item p-1'
            >
              <div className='text-dark post-side__item-title'>
                {post.title}
              </div>
              <div className='post-side__item-comt'>{`Comments ${post.commentsCount}`}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
DicussPosts.propTypes = {
  discuss_posts: PropTypes.array.isRequired,
  getDiscussPosts: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  discuss_posts: state.side_posts.discuss_posts,
});
export default connect(mapStateToProps, { getDiscussPosts })(DicussPosts);
