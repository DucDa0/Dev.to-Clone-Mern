import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

// router/redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// component
import Posts from './Posts';

// action
import { getCurrentProfile } from '../../actions/profile';
import { getPostByUser } from '../../actions/post';

// others
import Moment from 'react-moment';
import { Loader } from '../loader/Loader';

const Me = ({
  auth,
  profile: { profile, posts, loading },
  getCurrentProfile,
  getPostByUser,
}) => {
  useEffect(() => {
    async function loadData() {
      await getPostByUser(auth.user._id);
      await getCurrentProfile();
    }
    loadData();
  }, [getCurrentProfile, getPostByUser, auth.user._id]);
  return loading || !profile || !posts ? (
    <Loader size={46} isButton={false} />
  ) : (
    <Fragment>
      <div className='me'>
        <div
          className='me__banner'
          style={{ backgroundColor: `${profile.brand_color}` }}
        >
          <div className='me__wrap'>
            <div className='me__content bg-white'>
              <div className='action-follow'>
                <Link
                  to='/settings'
                  style={{ marginRight: 0 }}
                  className='btn btn-dark'
                >
                  Edit Profile
                </Link>
              </div>
              <div className='me__top'>
                <img
                  style={{
                    backgroundColor: `${profile.brand_color}`,
                    objectFit: 'cover',
                  }}
                  className='round-img me-avatar'
                  alt=''
                  src={profile.user.avatar}
                />
              </div>
              <div className='me__info'>
                <h1 className='text-dark me-name'>{profile.user.name}</h1>
                {profile.bio && (
                  <p className='text-dark me-bio'>{profile.bio}</p>
                )}

                <div className='me-meta'>
                  {profile.locations && (
                    <p className='me-location'>
                      <i
                        className='fas fa-map-marker-alt'
                        style={{ fontSize: '1.25rem', marginRight: '8px' }}
                      />
                      {profile.locations}
                    </p>
                  )}

                  <p className='me-location'>
                    <i
                      className='fas fa-birthday-cake'
                      style={{ fontSize: '1.25rem', marginRight: '8px' }}
                    />
                    Joined <Moment format='DD/MM/YYYY'>{profile.date}</Moment>
                  </p>
                  <p className='me-social'>
                    {profile.social.github && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.github}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-github'
                        />
                      </a>
                    )}
                    {profile.social.twitter && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.twitter}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-twitter'
                        />
                      </a>
                    )}
                    {profile.social.facebook && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.facebook}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-facebook'
                        />
                      </a>
                    )}
                    {profile.social.youtube && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.youtube}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-youtube'
                        />
                      </a>
                    )}
                    {profile.social.linkedin && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.linkedin}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-linkedin'
                        />
                      </a>
                    )}
                    {profile.social.instagram && (
                      <a
                        style={{ display: 'block' }}
                        href={profile.social.instagram}
                      >
                        <i
                          style={{ fontSize: '1.25rem', marginRight: '8px' }}
                          className='fab fa-instagram'
                        />
                      </a>
                    )}
                  </p>
                </div>
              </div>
              <div className='me-work'>
                <div className='me-work__wrap'>
                  {profile.education && (
                    <div className='me-work__item'>
                      <span className='text-dark'>Education</span>
                      <p className='text-dark'>{profile.education}</p>
                    </div>
                  )}
                  {profile.title && (
                    <div className='me-work__item'>
                      <span className='text-dark'>Work</span>
                      <p className='text-dark'>{profile.title}</p>
                    </div>
                  )}
                  {profile.website && (
                    <div className='me-work__item'>
                      <span className='text-dark'>Website</span>
                      <a
                        style={{ display: 'block', fontSize: '1rem' }}
                        href={profile.website}
                      >
                        <i className='fas fa-link' />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Posts posts={posts} profile_data={profile} />
        </div>
      </div>
    </Fragment>
  );
};
Me.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getCurrentProfile, getPostByUser })(
  Me
);
