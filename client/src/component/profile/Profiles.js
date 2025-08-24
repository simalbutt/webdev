import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { getallProfile } from '../../action/profile';
import { Link } from 'react-router-dom';
const Profiles = ({ profile: { profiles, loading }, getallProfile }) => {
  useEffect(() => {
    getallProfile();
  }, [getallProfile]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and connect with
            developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <div className='profile bg-light' key={profile._id}>
                  <img className='round-img' src={profile.user.avatar} alt='' />
                  <div>
                    <h2>{profile.user.name}</h2>
                    <p>
                      {profile.status}{' '}
                      {profile.company ? (
                        <span> at {profile.company}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className='my-1'>
                      {profile.location ? <span>{profile.location}</span> : ''}
                    </p>
                    <Link
                      to={`/profile/${profile.user._id}`}
                      className='btn btn-primary'
                    >
                      View Profile
                    </Link>
                  </div>
                  <ul>
                    {profile.skills.slice(0, 4).map((skill, index) => (
                      <li key={index} className='text-primary'>
                        <i className='fas fa-check'></i> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <h4>No profile found....</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getallProfile: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getallProfile })(Profiles);
