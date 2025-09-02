import React from 'react';
import { Link } from 'react-router-dom';

const Dashboardaction = () => {
  return (
    <div className="dash-buttons">
      <Link to="/editprofile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary"></i> Edit Profile
      </Link>
      <Link to="/addexperience" className="btn btn-light">
        <i className="fab fa-black-tie text-primary"></i> Add Experience
      </Link>
      <Link to="/addeducation" className="btn btn-light">
        <i className="fas fa-graduation-cap text-primary"></i> Add Education
      </Link>
       <Link to="/myposts" className="btn btn-light">
        <i className="fas fa-edit text-primary"></i> Your Posts
      </Link>
    </div>
  );
};

export default Dashboardaction;
