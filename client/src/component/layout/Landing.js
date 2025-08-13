import React from 'react';
import { Link ,Navigate} from 'react-router-dom';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const Landing = ({isAuthanticated}) => {
  if(isAuthanticated){
    return <Navigate to="/dashboard"/>
  }
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>DevNet</h1>
          <p className='lead'>
            Build your profile. Share your story. Get the help you need to level
            up.
          </p>
          <div className='buttons'>
            <Link to='/signup' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes={
  isAuthanticated:PropTypes.bool,
}
const mapStateToProps=state=>({
  isAuthanticated:state.auth.isAuthanticated
})

export default connect(mapStateToProps)(Landing);
