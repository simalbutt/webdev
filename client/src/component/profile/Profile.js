import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { getProfileById } from '../../action/profile';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import Profileabout from './Profileabout';
import Profileexp from './Profileexp';
import Profileedu from './Profileedu.js';
import Profilerepo from './Profilerepo.js';

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
  const { id } = useParams();
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link
            to='/Profiles'
            className='btn btn-light'
            style={{ marginTop: '8rem' }}
          >
            Back To Profiles
          </Link>
          {auth.isAuthanticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link
                to='/editprofile'
                className='btn btn-dark'
                style={{ marginTop: '8rem' }}
              >
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <Profileabout profile={profile} />

            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => (
                    <Profileexp key={experience._id} experience={experience} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education) => (
                    <Profileedu key={education._id} education={education} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Education Credentials</h4>
              )}
              {profile.githubusername && (<Profilerepo username={profile.githubusername} />)}
              
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
