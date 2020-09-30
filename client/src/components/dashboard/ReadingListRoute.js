import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// component
import Dashboard from './Dashboard';
import ReadingList from './ReadingList';

// others
import { Loader } from '../loader/Loader';
import api from '../../utils/api';
function ReadingListRoute({ user, location }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    async function getData() {
      await api.get('/users/get-reading-list');
    }
    getData();
  }, []);
  useEffect(() => {
    const data = !user ? [] : user.bookMarkedPosts;
    const results = data.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <Dashboard checkPage={location.pathname}>
      <div className='reading-list__head'>
        <h3 className='text-dark'>Reading list</h3>
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder='Search...'
          type='text'
          className='header-search_bar-input reading-list__input'
        />
      </div>

      <div className='post-list my-1'>
        {!user ? (
          <Loader size={46} isButton={false} />
        ) : (
          searchResults.map((post) => (
            <ReadingList key={post._id} post={post} />
          ))
        )}
      </div>
    </Dashboard>
  );
}
ReadingListRoute.propTypes = {
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(ReadingListRoute);
