import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { getPosts } from '../../actions/post';

// component
import PostFeed from './PostFeed';
import LoginPopUp from '../auth/LoginPopUp';
import UserFeedSide from './UserFeedSide';
import TopFeedFilter from './TopFeedFilter';
import TagRecommend from './TagRecommend';
import Welcome from './Welcome';
import DicussPosts from './DicussPosts';
import NewsPosts from './NewsPosts';
import HelpPosts from './HelpPosts';

// icons
import { LeftSideFeed } from '../icons/icons';

// others
import { Loader } from '../loader/Loader';
import moment from 'moment';

const Posts = ({
  _auth,
  getPosts,
  post: { posts, loading },
  location,
  usersCount,
}) => {
  const [auth, setAuth] = useState(false);
  const [showRSide, setShowRSide] = useState(false);
  const [showLSide, setShowLSide] = useState(false);
  const [filterStatus, setFilterStatus] = useState('latest');
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // get d/m/y from data
  const getMonthValue = (value) => {
    const res = new Date(value);
    return res.getMonth() + 1;
  };
  const getDateValue = (value) => {
    const res = new Date(value);
    return res.getDate();
  };
  const getYearValue = (value) => {
    const res = new Date(value);
    return res.getFullYear();
  };

  // get d/m/y now
  const Year = () => {
    return moment().year();
  };
  const Dates = () => {
    return moment().date();
  };
  const Month = () => {
    return moment().month() + 1;
  };
  const dataFilter =
    filterStatus === 'date'
      ? posts.filter((post) => getDateValue(post.date) === Dates())
      : filterStatus === 'month'
      ? posts.filter((post) => getMonthValue(post.date) === Month())
      : filterStatus === 'year'
      ? posts.filter((post) => getYearValue(post.date) === Year())
      : posts;
  const handleClickSide = (e) => {
    if (e.target.classList.contains('backdrop-side')) {
      setShowRSide(false);
      setShowLSide(false);
      document.body.style.overflow = '';
    }
  };
  return (
    <Fragment>
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}

      <div className='post feed container'>
        <div
          onClick={handleClickSide}
          className={!showLSide ? 'my feed-left' : 'my feed-left backdrop-side'}
        >
          <div className='left-side-feed__wrap'>
            <div className='left-side-feed'>
              <UserFeedSide _auth={_auth} />
              <TagRecommend />
            </div>
          </div>
        </div>
        <div className='my'>
          <div className='top-feed'>
            <div
              onClick={() => {
                document.body.style.overflow = 'hidden';
                setShowLSide(true);
              }}
              className='left-side-feed__icon'
            >
              <LeftSideFeed />
            </div>
            <h4 className='text-dark'>Posts</h4>
            <TopFeedFilter
              path={location.pathname}
              setShowRSide={setShowRSide}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
          {loading || !posts ? (
            <Loader size={46} isButton={false} />
          ) : (
            <Fragment>
              {dataFilter.map((post, index) => (
                <PostFeed
                  index={index}
                  path={location.pathname}
                  key={post._id}
                  post={post}
                  setAuth={setAuth}
                />
              ))}
            </Fragment>
          )}
        </div>
        <div
          onClick={handleClickSide}
          className={
            !showRSide ? 'my feed-right' : 'my feed-right backdrop-side'
          }
        >
          <div className='right-side-feed__wrap'>
            <div className='right-side-feed'>
              <Welcome _auth={_auth} usersCount={usersCount} />
              <DicussPosts />
              <NewsPosts />
              <HelpPosts />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getPopularTags: PropTypes.func,
  post: PropTypes.object.isRequired,
  usersCount: PropTypes.number,
  _auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  usersCount: state.post.usersCount,
  _auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Posts);
