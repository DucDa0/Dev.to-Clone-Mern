import React from 'react';
import PropTypes from 'prop-types';

// Router/redux
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

function Dashboard({ children, checkPage, user }) {
  let history = useHistory();
  const handleNavigate = (e) => {
    let filter = e.target.value;
    switch (filter) {
      case 'posts':
        return history.push('/dashboard');
      case 'followers':
        return history.push('/dashboard/followers');
      case 'followings':
        return history.push('/dashboard/followings');
      case 'reading-list':
        return history.push('/dashboard/reading-list');
      case 'tags':
        return history.push('/dashboard/following-tags');
      default:
        return '';
    }
  };
  return (
    <div className='dashboard-container container'>
      <div className='dashboard my-1'>
        <div className='dashboard__wrap'>
          <h1 className='dashboard__title text-dark'>Dashboard</h1>
          <select
            value={
              checkPage === '/dashboard'
                ? 'posts'
                : checkPage === '/dashboard/followers'
                ? 'followers'
                : checkPage === '/dashboard/followings'
                ? 'followings'
                : checkPage === '/dashboard/reading-list'
                ? 'reading-list'
                : 'tags'
            }
            onChange={handleNavigate}
            className='select filter-feed-select dashboard-select'
          >
            <option value='posts'>Posts</option>
            <option value='followers'>Followers</option>
            <option value='followings'>Following</option>
            <option value='reading-list'>Reading list</option>
            <option value='tags'>Tags</option>
          </select>
          <div className='dashboard__content my-1'>
            <aside className='dashboard__side'>
              <div className='dashboard__side-wrap'>
                <div className='side-setting'>
                  <Link
                    style={{
                      display: 'flex',
                      width: '100%',
                      backgroundColor:
                        checkPage !== '/dashboard' ? '#eef0f1' : '#fff',
                      padding: '0.5rem',
                      justifyContent: 'space-between',
                    }}
                    to='/dashboard'
                    className='btn btn-light'
                  >
                    <div>Posts</div>
                    <div className='count-dashboard'>{user.postCount}</div>
                  </Link>
                  <Link
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor:
                        checkPage !== '/dashboard/followers'
                          ? '#eef0f1'
                          : '#fff',
                      padding: '0.5rem',
                    }}
                    to='/dashboard/followers'
                    className='btn btn-light'
                  >
                    <div>Followers</div>
                    <div className='count-dashboard'>{user.followersCount}</div>
                  </Link>
                  <Link
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor:
                        checkPage !== '/dashboard/followings'
                          ? '#eef0f1'
                          : '#fff',
                      padding: '0.5rem',
                    }}
                    to='/dashboard/followings'
                    className='btn btn-light'
                  >
                    <div>Followings</div>
                    <div className='count-dashboard'>{user.followingCount}</div>
                  </Link>
                  <Link
                    style={{
                      display: 'flex',
                      width: '100%',
                      backgroundColor:
                        checkPage !== '/dashboard/reading-list'
                          ? '#eef0f1'
                          : '#fff',
                      padding: '0.5rem',
                      justifyContent: 'space-between',
                    }}
                    to='/dashboard/reading-list'
                    className='btn btn-light'
                  >
                    <div>Reading list</div>
                    <div className='count-dashboard'>
                      {user.bookMarkedPostsCount}
                    </div>
                  </Link>
                  <Link
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor:
                        checkPage !== '/dashboard/following-tags'
                          ? '#eef0f1'
                          : '#fff',
                      padding: '0.5rem',
                    }}
                    to='/dashboard/following-tags'
                    className='btn btn-light'
                  >
                    <div>Following Tags</div>
                    <div className='count-dashboard'>{user.tagCounts}</div>
                  </Link>
                </div>
              </div>
            </aside>
            <div className='dashboard__main'>
              <div className='dashboard__main-wrap'>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(Dashboard);
