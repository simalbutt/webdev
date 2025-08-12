import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../action/alert';
import { registerUser } from '../../action/signupauth';

import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
import '../css/signup.css';

const Signup = ({ setAlert, registerUser, isAuthanticated }) => {
  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState([]);

  const { name, email, password, password2 } = formdata;
  //  const dispatch = useDispatch();
  const onChange = (e) =>
    setFormdata({ ...formdata, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (password !== password2) {
      setAlert('password doesnot match', 'danger');
      return;
    } else {
      registerUser({ name, email, password });
    }

    //connecting with backend without redux
    // const newuser = { name, email, password };

    // try {
    //   const config = {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   };

    //   const body = JSON.stringify(newuser);
    //   const res = await axios.post('/api/user', body, config);

    //   console.log(res.data); // e.g., token or success message
    // } catch (err) {
    //   if (err.response && err.response.data.errors) {
    //     // Express-validator sends { errors: [ { msg: '...' } ] }
    //     setErrors(err.response.data.errors);
    //   } else {
    //     setErrors([{ msg: err.message }]);
    //   }
    // }
  };

  if (isAuthanticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className='signup-page'>
      <div className='landing-inner'>
        <Fragment>
          <h1 className='large text-primary text-center'>Sign Up</h1>
          <p className='lead text-center'>
            <i className='fas fa-user'></i> Create Your Account
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
            <div className='form-group'>
              <input
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                onChange={onChange}
                // required
              />
            </div>
            <div className='form-group'>
              <input
                type='email'
                placeholder='Email Address'
                name='email'
                value={email}
                onChange={onChange}
                // required
              />
              <small className='form-text'>
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                // minLength="6"
                value={password}
                onChange={onChange}
                // required
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Confirm Password'
                name='password2'
                // minLength="6"
                value={password2}
                onChange={onChange}
                // required
              />
            </div>
            <input type='submit' className='btn btn-primary' value='Register' />
          </form>

          <p className='my-1'>
            Already have an account? <Link to='/login'>Log In</Link>
          </p>
        </Fragment>
      </div>
    </div>
  );
};
Signup.prototype = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthanticated: state.auth.isAuthanticated,
});

export default connect(mapStateToProps, { setAlert, registerUser })(Signup); //first index is state , 2nd one is action
