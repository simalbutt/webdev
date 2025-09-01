import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { useParams } from 'react-router-dom';
import { getPost } from '../../action/post';
import Postitem from './Postitem';
import { Link } from 'react-router-dom';
import Commentform from './Commentform'
import Commentitem from './Commentitem'
const Singlepost = ({ getPost, post: { post, loading } }) => {
     const { id } = useParams();
  useEffect(() => {
    getPost(id);
  }, [getPost, id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
       <div className='onepost'>
        <Link to='/posts' className='btn btn-light'>Back To Posts</Link>

        <Postitem post={post} showactions={false} />
        <div className="comments">
            {
                post.comments.map(comment => (
                    <Commentitem key={comment._id} comment={comment} postId={post._id} />
                ))
            }
        </div>
        <Commentform postId={post._id} />
        
       </div>
      
    </Fragment>
  )
};


Singlepost.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPost })(Singlepost);
