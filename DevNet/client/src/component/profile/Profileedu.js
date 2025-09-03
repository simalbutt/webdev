import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Profileedu = ({
  education: { school, degree, fieldOfStudy, from, to, current, description },
}) => {
  return (
    <div>
      <h3 className="text-dark">
        <strong>{school}</strong>
      </h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{' '}
        {!to ? ' Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong> {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong> {fieldOfStudy}
      </p>
      {description && (
        <p>
          <strong>Description: </strong> {description}
        </p>
      )}
    </div>
  );
};

Profileedu.propTypes = {
  education: PropTypes.shape({
    school: PropTypes.string,
    degree: PropTypes.string,
    fieldOfStudy: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    current: PropTypes.bool,
    description: PropTypes.string,
  }).isRequired,
};

export default Profileedu;
