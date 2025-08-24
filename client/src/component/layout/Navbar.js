import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../action/signupauth';

const Navbar = ({ auth: { isAuthanticated, loading }, logoutUser }) => {
  const authLink = (
    <ul>
      <li>
        <Link to='/Profiles'>
        Developers
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
        <i className='fas fa-user'></i>{' '}
       <span className='hide-sm'>Dashboard</span> </Link>
      </li>
      <li>
        <a onClick={logoutUser} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLink = (
    <ul>
      <li>
        <Link to='/Profiles'>
        Developers
        </Link>
      </li>
      <li>
        <Link to='/signup'>Signup</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevNet
        </Link>
      </h1>
      {!loading && (
        <Fragment>
          {isAuthanticated ? authLink : guestLink}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
