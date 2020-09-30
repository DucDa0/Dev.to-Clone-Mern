import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import PostFeed from '../posts/PostFeed';
import LoginPopUp from '../auth/LoginPopUp';
import TopFeedFilter from '../posts/TopFeedFilter';

import moment from 'moment';

const Posts = ({ posts }) => {
  const [auth, setAuth] = useState(false);
  const [filterStatus, setFilterStatus] = useState('feed');
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
          <Fragment>
            {dataFilter.map((post) => (
              <PostFeed key={post._id} post={post} setAuth={setAuth} />
            ))}
          </Fragment>
        </div>
        <div></div>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
