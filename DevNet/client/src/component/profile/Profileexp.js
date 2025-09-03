import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const Profileexp = ({ experience :{
    company,
    title,
    location,
    from,
    to,
    current,
    description
}}) => {
  return (
    <div>
      <h3 className="text-dark">
        <strong>{company}</strong>
      </h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{' '}
        {!to ? ' Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong> {title}
      </p>
      <p>
        <strong>Description: </strong> {description}
      </p>
    </div>
  )
}

Profileexp.propTypes = {
    experience: PropTypes.shape({
        company: PropTypes.string,
        title: PropTypes.string,
        location: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
        current: PropTypes.bool,
        description: PropTypes.string
    }).isRequired
}


export default Profileexp
