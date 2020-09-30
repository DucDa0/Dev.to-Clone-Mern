import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../../store';

// action
import { getHelpPosts } from '../../actions/post';

function HelpPosts({ help_posts, getHelpPosts }) {
  useEffect(() => {
    getHelpPosts();
  }, [getHelpPosts]);
  return (
    <div className='post-side'>
      <div className='post-side__wrap'>
        <Link
          onClick={() => store.dispatch({ type: 'CLEAR_TAG' })}
          to='/tags/5f6f2a04468cdd24307fee92/help'
          className='text-dark post-side__title p'
        >
          <span>#help</span>
        </Link>
        <div className='post-side__content'>
          {help_posts.map((post) => (
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
HelpPosts.propTypes = {
  help_posts: PropTypes.array.isRequired,
  getHelpPosts: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  help_posts: state.side_posts.help_posts,
});
export default connect(mapStateToProps, { getHelpPosts })(HelpPosts);
