import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../action/profile';
import Spinner from '../layout/spinner';
import Experience from '../dashboard/Experience';  
import Education from '../dashboard/Education'; 
import Dashboardaction from '../dashboard/Dashboardaction';   

const Profile = ({ getCurrentProfile, profile: { profile, loading }, auth }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  // Show Spinner while loading
  if (loading && profile === null) {
    return <Spinner />;
  }

  return (
    <div className="onepost">
         <section className="container">
        <h1 className="large text-primary">My Profile</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome to your profile  {auth.user && auth.user.name}
        </p>
        </section>
      {profile !== null ? (
        <Fragment>
          <Dashboardaction/>
          {profile.experience && profile.experience.length > 0 ? (
            <Experience experience={profile.experience} />
          ) : (
            <p>No experience details available</p>
          )}

          {profile.education && profile.education.length > 0 ? (
            <Education education={profile.education} />
          ) : (
            <p>No education details available</p>
          )}
        </Fragment>
      ) : (
        <p>No profile found, please create one.</p>
      )}
    </div>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Profile);
