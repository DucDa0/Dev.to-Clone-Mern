import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// action
import { createProfile, getCurrentProfile } from '../../actions/profile';

// component
import Setting from './Setting';

// others
import { Loader } from '../loader/Loader';

const initialState = {
  website: '',
  locations: '',
  title: '',
  skills: '',
  bio: '',
  education: '',
  brand_color: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: '',
  github: '',
};

const Profile = ({
  location,
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
}) => {
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isCompleted, setComplete] = useState(false);
  const [color, setColor] = useState('');
  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) {
          if (key === 'brand_color') {
            setColor(profile[key]);
          }
          profileData[key] = profile[key];
        }
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);
  const {
    website,
    locations,
    title,
    skills,
    bio,
    education,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
    github,
  } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setComplete(true);
    const res = await createProfile({ ...formData, brand_color: color });
    if (res) {
      return setComplete(false);
    } else {
      return setComplete(false);
    }
  };
  return (
    <Setting checkPage={location.pathname}>
      {loading || !profile ? (
        <Loader size={46} isButton={false} />
      ) : (
        <div className='main-setting bg-white'>
          <div className='main-setting__dashboard'>
            <p className='my-1'>
              <i className='far fa-edit' /> (*) Fill out all this fields to
              everyone known more about you!
            </p>
            <form className='form' onSubmit={onSubmit}>
              <label htmlFor='website'>Website</label>
              <div className='form-group form-fix'>
                <input
                  type='text'
                  name='website'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={website}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='location'>Location</label>
              <div className='form-group form-fix'>
                <input
                  type='text'
                  name='locations'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={locations}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='title'>Employment title</label>
              <div className='form-group form-fix'>
                <input
                  type='text'
                  name='title'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={title}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='education'>Education</label>
              <div className='form-group form-fix'>
                <input
                  type='text'
                  name='education'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={education}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='brand_color'>Brand color</label>
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 4fr' }}
                className='form-group form-fix'
              >
                <input
                  type='text'
                  name='brand_color'
                  style={{
                    borderRadius: '5px',
                    height: '50px',
                    backgroundColor: '#f9fafa',
                  }}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  name='color'
                  style={{
                    height: '50px',
                    width: '60px',
                    alignSelf: 'center',
                    marginLeft: '20px',
                    border: '1px solid #ddd',
                  }}
                  type='color'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <label htmlFor='skills'>Skills/Languages</label>
              <div className='form-group form-fix'>
                <textarea
                  name='skills'
                  style={{
                    borderRadius: '5px',
                    height: '150px',
                    resize: 'none',
                    backgroundColor: '#f9fafa',
                  }}
                  value={skills}
                  onChange={onChange}
                />
              </div>
              <label htmlFor='bio'>Bio</label>
              <div className='form-group form-fix'>
                <textarea
                  name='bio'
                  style={{
                    borderRadius: '5px',
                    height: '150px',
                    resize: 'none',
                    backgroundColor: '#f9fafa',
                  }}
                  value={bio}
                  onChange={onChange}
                />
              </div>
              <div className='my-2'>
                <button
                  onClick={() => toggleSocialInputs(!displaySocialInputs)}
                  type='button'
                  className='btn btn-light'
                >
                  Add Social Network Links
                </button>
              </div>

              {displaySocialInputs && (
                <Fragment>
                  <div className='form-group social-input'>
                    <i className='fab fa-github fa-2x'></i>
                    <input
                      type='text'
                      placeholder='Github URL'
                      name='github'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={github}
                      onChange={onChange}
                    />
                  </div>
                  <div className='form-group social-input'>
                    <i className='fab fa-twitter fa-2x' />
                    <input
                      type='text'
                      placeholder='Twitter URL'
                      name='twitter'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={twitter}
                      onChange={onChange}
                    />
                  </div>

                  <div className='form-group social-input'>
                    <i className='fab fa-facebook fa-2x' />
                    <input
                      type='text'
                      placeholder='Facebook URL'
                      name='facebook'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={facebook}
                      onChange={onChange}
                    />
                  </div>

                  <div className='form-group social-input'>
                    <i className='fab fa-youtube fa-2x' />
                    <input
                      type='text'
                      placeholder='YouTube URL'
                      name='youtube'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={youtube}
                      onChange={onChange}
                    />
                  </div>

                  <div className='form-group social-input'>
                    <i className='fab fa-linkedin fa-2x' />
                    <input
                      type='text'
                      placeholder='Linkedin URL'
                      name='linkedin'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={linkedin}
                      onChange={onChange}
                    />
                  </div>

                  <div className='form-group social-input'>
                    <i className='fab fa-instagram fa-2x' />
                    <input
                      type='text'
                      placeholder='Instagram URL'
                      name='instagram'
                      style={{
                        borderRadius: '5px',
                        height: '50px',
                        backgroundColor: '#f9fafa',
                      }}
                      value={instagram}
                      onChange={onChange}
                    />
                  </div>
                </Fragment>
              )}
              <Loader size={36} loading={isCompleted} isButton={true} />
              {!isCompleted && (
                <input
                  type='submit'
                  value='Save'
                  className='btn btn-dark my-1'
                />
              )}
            </form>
          </div>
        </div>
      )}
    </Setting>
  );
};

Profile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  Profile
);
