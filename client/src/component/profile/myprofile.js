import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../action/profile';
import Spinner from '../layout/spinner';
import Experience from '../dashboard/Experience';
import Education from '../dashboard/Education';
import Dashboardaction from '../dashboard/Dashboardaction';
import { Link } from 'react-router-dom';

const Profile = ({
  getCurrentProfile,
  deleteAccount,
  profile: { profile, loading },
  auth,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  if (loading && profile === null) {
    return <Spinner />;
  }

  return (
    <div >
      <section className="onepost" >
        <h1 className="large text-primary">My Profile</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome {auth.user && auth.user.name}
        </p>

        {profile !== null ? (
          <Fragment>
            <Dashboardaction />

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

            {/* Delete Account Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                className="btn btn-danger"
                onClick={() => deleteAccount()}
              >
                <i className="fas fa-user-times"></i> Delete My Account
              </button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>No profile found, please create one.</p>
            <Link to="/createprofile" className="btn btn-primary my-1">
              Create Profile
            </Link>
          </Fragment>
        )}
      </section>
    </div>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Profile);
