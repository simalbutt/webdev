import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../action/profile';
import { Link, useNavigate } from 'react-router-dom';

const AddEducation = ({ addEducation }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const [todatedisable, setTodateDisable] = useState(false);
  const navigate = useNavigate();
  // const {addExperience} = props
const { school, degree, fieldOfStudy, from, to, current, description }= formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <Fragment>
      <div className='onepost'>
      <h1 className='large text-primary'>Add An Edcation</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any School/Degree
        you have attend 
      </p>
      <small>* = required field</small>
      <form
        className='form'
        onSubmit={(e) => {
          e.preventDefault();
          //  console.log('Submitting:', formData);
          addEducation(formData, navigate);
          // navigate('/Myprofile')

        }}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School'
            name='school'
            value={school}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Degree or Certificate'
            name='degree'
            value={degree}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field Of Study'
            name='fieldOfStudy'
            value={ fieldOfStudy}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
            //   value='current'
              checked={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                setTodateDisable(!todatedisable);
              }}
            />{' '}
            {'  '} Current School
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={(e) => onChange(e)}
            disabled={todatedisable ? 'disabled' : ''}
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/Myprofile'>
          Go Back
        </Link>
      </form>
      </div>
    </Fragment>
  );
};
AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
