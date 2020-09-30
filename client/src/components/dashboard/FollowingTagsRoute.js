import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// component
import Dashboard from './Dashboard';
import TagCard from './TagCard';

// others
import { Loader } from '../loader/Loader';
function FollowingTagsRoute({ user, location }) {
  return (
    <Dashboard checkPage={location.pathname}>
      <div className='followers__main'>
        {!user ? (
          <Loader size={46} isButton={false} />
        ) : (
          user.followingTags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        )}
      </div>
    </Dashboard>
  );
}
FollowingTagsRoute.propTypes = {
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(FollowingTagsRoute);
