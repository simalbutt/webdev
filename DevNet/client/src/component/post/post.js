import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../action/post';
import Spinner from '../layout/spinner';
import Postitem from './Postitem';
// import { Link } from 'react-router-dom';

const Post = ({ getPosts, post: { posts, loading }, auth }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className='posts-page-container'>
        {/* LEFT SIDEBAR */}
        <div className='sidebar'>
          <h2>Welcome {auth?.user?.name} </h2>

          {/* <p className="designation"> {profile?.profile?.status}</p> */}
          {/* <Link to='/create-post' className='btn btn-primary create-post-btn'>
            Create Post
          </Link> */}
        </div>

        {/* MAIN CONTENT */}
        <div className='posts-section'>
          <h1 className='large text-primary'>Posts</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome to the community
          </p>
          <div className='posts'>
            {posts.map((post) => (
              <Postitem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Post);
