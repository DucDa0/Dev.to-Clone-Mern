import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// component
import Dashboard from './Dashboard';
import Followers from './Followers';

// others
import { Loader } from '../loader/Loader';
function FollowersRoute({ user, location }) {
  return (
    <Dashboard checkPage={location.pathname}>
      <div className='followers__main'>
        {!user ? (
          <Loader size={46} isButton={false} />
        ) : (
          user.followers.map((follower) => (
            <Followers key={follower._id} follower={follower} />
          ))
        )}
      </div>
    </Dashboard>
  );
}
FollowersRoute.propTypes = {
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(FollowersRoute);
