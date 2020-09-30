import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// component
import Dashboard from './Dashboard';
import Followings from './Followings';

// others
import { Loader } from '../loader/Loader';
function FollowingsRoute({ user, location }) {
  return (
    <Dashboard checkPage={location.pathname}>
      <div className='followers__main'>
        {!user ? (
          <Loader size={46} isButton={false} />
        ) : (
          user.following.map((following) => (
            <Followings key={following._id} following={following} />
          ))
        )}
      </div>
    </Dashboard>
  );
}
FollowingsRoute.propTypes = {
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(FollowingsRoute);
