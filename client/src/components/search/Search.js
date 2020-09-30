import React, { useEffect, useState } from 'react';

import SearchItem from './SearchItem';
import People from './People';

import api from '../../utils/api';

import { Loader } from '../loader/Loader';
import queryString from 'query-string';

function Search({ location }) {
  const [filterValue, setFilterValue] = useState('post');
  const [data, setData] = useState(null);
  useEffect(() => {
    let q = queryString.parse(location.search).q;
    async function getData() {
      const res = await api.get(`/posts/dev/search?q=${q}`);
      const { posts, users, comments } = res.data;
      setData({ posts, users, comments });
    }
    getData();
  }, [location.search]);
  return !data ? (
    <Loader size={46} isButton={false} />
  ) : (
    <div className='notify-container container'>
      <div className='notify-select'>
        <button
          onClick={() => {
            setFilterValue('post');
          }}
          style={{
            borderBottom: filterValue === 'post' ? '3px solid royalblue' : '',
          }}
          className='btn btn-light btn-hover'
        >
          Post
        </button>
        <button
          onClick={() => {
            setFilterValue('people');
          }}
          style={{
            borderBottom: filterValue === 'people' ? '3px solid royalblue' : '',
          }}
          className='btn btn-light btn-hover'
        >
          People
        </button>
        <button
          onClick={() => {
            setFilterValue('comment');
          }}
          style={{
            borderBottom:
              filterValue === 'comment' ? '3px solid royalblue' : '',
          }}
          className='btn btn-light btn-hover'
        >
          Comments
        </button>
      </div>
      <div className='notify-home my-1'>
        <div className='notify-home__side'>
          <button
            onClick={() => {
              setFilterValue('post');
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: filterValue === 'post' ? '#fff' : '#eef0f1',
              padding: '0.35rem',
            }}
            className='btn btn-light'
          >
            <div>Posts</div>
            <div className='count-dashboard'>{data.posts.length}</div>
          </button>

          <button
            onClick={() => {
              setFilterValue('people');
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: filterValue === 'people' ? '#fff' : '#eef0f1',
              padding: '0.35rem',
            }}
            className='btn btn-light'
          >
            <div>People</div>
            <div className='count-dashboard'>{data.users.length}</div>
          </button>
          <button
            onClick={() => {
              setFilterValue('comment');
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: filterValue === 'comment' ? '#fff' : '#eef0f1',
              padding: '0.35rem',
            }}
            className='btn btn-light'
          >
            <div>Comments</div>
            <div className='count-dashboard'>{data.comments.length}</div>
          </button>
        </div>

        <div className='notify-home__main'>
          {filterValue === 'post'
            ? data.posts.map((post) => (
                <SearchItem data={post} key={post._id} />
              ))
            : filterValue === 'comment'
            ? data.comments.map((post) => (
                <SearchItem data={post} key={post._id} />
              ))
            : data.users.map((user) => <People data={user} key={user._id} />)}
        </div>
      </div>
    </div>
  );
}
export default Search;
