import React from 'react';
import PropTypes from 'prop-types';
import PuffLoader from 'react-spinners/PuffLoader';

export const Loader = ({ size, isButton }) => {
  return (
    <div
      style={
        !isButton
          ? {
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }
          : { display: 'flex', justifyContent: 'center' }
      }
    >
      <PuffLoader size={size} color={'#3b49df'} loading={true} />
    </div>
  );
};
Loader.propTypes = {
  size: PropTypes.number,
  loading: PropTypes.bool,
};
