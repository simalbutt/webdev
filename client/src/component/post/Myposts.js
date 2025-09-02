import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import PostItem from './Postitem';
import { getMyPosts } from '../../action/post';
import Postform from './Postform';
import {Link} from 'react-router-dom'

const MyPosts = ({ getMyPosts, post: { myPosts, loading } }) => {
  useEffect(() => {
    getMyPosts();
  }, [getMyPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <div className='container'>
      <h1 className='large text-primary'>My Posts</h1>
      {myPosts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <>
          <Postform />
          {myPosts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </>
      )}
      <Link className='btn btn-primary' to='/myprofile'>
      Back to Profile
      </Link>
    </div>
  );
};

MyPosts.propTypes = {
  getMyPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getMyPosts })(MyPosts);
