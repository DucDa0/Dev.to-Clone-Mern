import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import PostFeed from '../posts/PostFeed';
import LoginPopUp from '../auth/LoginPopUp';
import TopFeedFilter from '../posts/TopFeedFilter';

import {
  getPostsByTagId,
  getPostsByTagId_Year,
  getPostsByTagId_Date,
  getPostsByTagId_Month,
} from '../../actions/tags';

import { Loader } from '../loader/Loader';

const Posts = ({
  posts,
  tagId,
  getPostsByTagId,
  getPostsByTagId_Year,
  getPostsByTagId_Date,
  getPostsByTagId_Month,
}) => {
  const [auth, setAuth] = useState(false);
  const [filterStatus, setFilterStatus] = useState('latest');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      switch (filterStatus) {
        case 'date':
          setLoading(true);
          await getPostsByTagId_Date(tagId);
          setLoading(false);
          break;
        case 'month':
          setLoading(true);
          await getPostsByTagId_Month(tagId);
          setLoading(false);
          break;
        case 'year':
          setLoading(true);
          await getPostsByTagId_Year(tagId);
          setLoading(false);
          break;
        default:
          setLoading(true);
          await getPostsByTagId(tagId);
          setLoading(false);
          break;
      }
    }
    getData();
  }, [
    getPostsByTagId,
    getPostsByTagId_Date,
    getPostsByTagId_Month,
    getPostsByTagId_Year,
    tagId,
    filterStatus,
  ]);

  return (
    <Fragment>
      {auth ? <LoginPopUp setAuth={setAuth} /> : null}

      <div className='post feed-profile post-profile my-1'>
        <div></div>
        <div>
          <div className='top-feed'>
            <h4 className='text-dark'>Posts</h4>
            <TopFeedFilter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
          {!posts || loading ? (
            <Loader size={46} isButton={false} />
          ) : (
            <Fragment>
              {posts.map((post) => (
                <PostFeed key={post._id} post={post} setAuth={setAuth} />
              ))}
            </Fragment>
          )}
        </div>
        <div></div>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  getPostsByTagId: PropTypes.func.isRequired,
  getPostsByTagId_Date: PropTypes.func.isRequired,
  getPostsByTagId_Month: PropTypes.func.isRequired,
  getPostsByTagId_Year: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  posts: state.tags.posts,
});
export default connect(mapStateToProps, {
  getPostsByTagId,
  getPostsByTagId_Date,
  getPostsByTagId_Month,
  getPostsByTagId_Year,
})(Posts);
