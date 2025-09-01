import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { RemoveComment } from '../../action/post';

const Commentitem = ({
  postId,
  comment: { _id, text, name, user, date },
  auth,
  RemoveComment,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link to={`/profile/${user}`}>
        <h4>{name}</h4>
        <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>
      </Link>
      {!auth.loading && user === auth.user._id && (
        <button
          type='button'
          className='btn btn-danger'
          onClick={(e) => RemoveComment(postId, _id)}
        >
          <i className='fas fa-times'></i>
        </button>
      )}
      
    </div>
    <div>
      <p >{text}</p>
      
    </div>
  </div>
);

Commentitem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  RemoveComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { RemoveComment })(Commentitem);
