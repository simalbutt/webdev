import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../action/signupauth';
// import axios from 'axios';
import '../css/signup.css';

const Login = ({ loginUser, isAuthanticated }) => {
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });

  const [errors] = useState([]);

  const { email, password } = formdata;

  const onChange = (e) =>
    setFormdata({ ...formdata, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  //redirect if loogedin
  if (isAuthanticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <div className='signup-page'>
      <div className='landing-inner'>
        <Fragment>
          <h1 className='large text-primary text-center'>Log In</h1>
          <p className='lead text-center'>
            <i className='fas fa-user'></i> Log In to Your Account
          </p>

          {/* Show errors if any */}
          {errors.length > 0 && (
            <div className='error-messages'>
              {errors.map((error, idx) => (
                <p key={idx} style={{ color: 'red' }}>
                  {error.msg}
                </p>
              ))}
            </div>
          )}

          <form className='form' onSubmit={onSubmit}>
            {/* <div className='form-group'>
            </div> */}
            <div className='form-group'>
              <input
                type='email'
                placeholder='Email Address'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                minLength='6'
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <input type='submit' className='btn btn-primary' value='Register' />
          </form>

          <p className='my-1'>
            Don't have an account? <Link to='/signup'>Sign up</Link>
          </p>
        </Fragment>
      </div>
    </div>
  );
};
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthanticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthanticated: state.auth.isAuthanticated,
});

export default connect(mapStateToProps, { loginUser })(Login);
