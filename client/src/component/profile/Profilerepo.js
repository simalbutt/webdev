import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../action/profile';
import Spinner from '../layout/spinner';

const ProfileRepo = ({ username, getGithubRepos, repos, loading, error }) => {
  useEffect(() => {
    if (username) {
      getGithubRepos(username);
    }
    return () => {
    };
  }, [getGithubRepos, username]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">GitHub Repositories</h2>

      {error && (
        <p className="text-danger">
          Unable to fetch repositories. Please check the username or try again later.
        </p>
      )}
      {!error && repos.length === 0 && (
        <p>No GitHub repositories found for this user.</p>
      )}
      {repos.length > 0 && (
        repos.map((repo) => (
          <div key={repo.id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              {repo.description && <p>{repo.description}</p>}
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">
                  Forks: {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileRepo.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool, // added error prop
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
  loading: state.profile.loading,
  error: state.profile.error, 
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileRepo);
