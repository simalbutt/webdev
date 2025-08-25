import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { RemoveComment } from '../../action/post';


const Commentitem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  RemoveComment,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img
          className='round-img'
          src={avatar || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'}
          alt=''
        />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>
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
