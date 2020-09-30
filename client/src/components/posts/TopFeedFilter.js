import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RightSideFeed } from '../icons/icons';

function TopFeedFilter({ filterStatus, setFilterStatus, setShowRSide, path }) {
  const [value, setValue] = useState('latest');
  useEffect(() => {
    setFilterStatus(value);
  }, [value, setFilterStatus]);
  return (
    <div className='top-feed__filter'>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='select filter-feed-select'
      >
        <option value='latest'>Latest</option>
        <option value='date'>Date</option>
        <option value='month'>Month</option>
        <option value='year'>Year</option>
      </select>

      <button
        style={{
          color: filterStatus === 'latest' ? 'royalblue' : '',
          borderBottom: filterStatus === 'latest' ? '3px solid royalblue' : '',
        }}
        onClick={() => setFilterStatus('latest')}
        className='btn btn-light btn-hover'
      >
        Latest
      </button>
      <button
        style={{
          color: filterStatus === 'date' ? 'royalblue' : '',
          borderBottom: filterStatus === 'date' ? '3px solid royalblue' : '',
        }}
        onClick={() => setFilterStatus('date')}
        className='btn btn-light btn-hover'
      >
        Date
      </button>
      <button
        style={{
          color: filterStatus === 'month' ? 'royalblue' : '',
          borderBottom: filterStatus === 'month' ? '3px solid royalblue' : '',
        }}
        onClick={() => setFilterStatus('month')}
        className='btn btn-light btn-hover'
      >
        Month
      </button>
      <button
        style={{
          color: filterStatus === 'year' ? 'royalblue' : '',
          borderBottom: filterStatus === 'year' ? '3px solid royalblue' : '',
        }}
        onClick={() => setFilterStatus('year')}
        className='btn btn-light btn-hover'
      >
        Year
      </button>
      {path === '/' && (
        <div
          onClick={() => {
            setShowRSide(true);
          }}
          className='right-side-feed__icon'
        >
          <RightSideFeed />
        </div>
      )}
    </div>
  );
}
TopFeedFilter.propTypes = {
  filterStatus: PropTypes.string.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
};

export default TopFeedFilter;
