// client/src/component/post/Postitem.js
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../action/post';

const Postitem = ({
  auth,
  post: { _id, text, name, avatar, user, comments, date, likes, image, video },
  addLike,
  removeLike,
  deletePost,
  showactions,
}) => {
  return (
    <Fragment>
      <div className='post bg-white p-3 my-2 rounded shadow-md'>
        <div className='flex items-center gap-3'>
          <div className='postheader'>
            <Link to={`/profile/${user}`}>
              <img
                className='round-img'
                src={
                  avatar ||
                  'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
                }
                alt={name}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Link>
            <Link to={`/profile/${user}`}>
              <div>
                <h3 style={{ margin: 0 }}>{name}</h3>
                <p className='text-sm text-gray-500'>
                  Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div>
          {/* image */}
          {image && (
            <div style={{ marginTop: 12 }}>
              <img
                src={image}
                alt='post'
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </div>
          )}

          {/* video */}
          {video && (
            <div style={{ marginTop: 12 }}>
              <video controls style={{ maxWidth: '100%', borderRadius: 8 }}>
                <source src={video} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <p className='my-2 posttext'>{text}</p>

          {showactions && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => addLike(_id)}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-up'></i>{' '}
                {likes.length > 0 && (
                  <span className='comment-count'>{likes.length}</span>
                )}
              </button>

              <button
                onClick={() => removeLike(_id)}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-down'></i>
              </button>

              <Link to={`/post/${_id}`} className='btn btn-primary'>
                Comments{' '}
                {comments.length > 0 && (
                  <span className='comment-count'>{comments.length}</span>
                )}
              </Link>

              {!auth.loading && user === auth.user._id && (
                <button
                  onClick={() => deletePost(_id)}
                  type='button'
                  className='btn btn-danger'
                >
                  <i className='fas fa-times'></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

Postitem.defaultProps = { showactions: true };

Postitem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  Postitem
);
