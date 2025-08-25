import React, {Fragment,useEffect}from 'react'
import PropTypes from 'prop-types'
import {connect } from 'react-redux'
import {getPosts} from '../../action/post'
import Spinner from '../layout/spinner'
import Postitem from './Postitem'
import Postform from './Postform'



const Post = ({getPosts,post:{posts,loading}}) => {
    useEffect(() => {
        getPosts()
    }, [getPosts])
  return loading? <Spinner/> : (
      <Fragment>
          <h1 className="large text-primary">Posts</h1>
          <p className="lead">
              <i className="fas fa-user"></i> Welcome to the community
          </p>
          <Postform/>

          <div className="posts">
              {posts.map(post=>(
                  <Postitem key={post._id} post={post}/>
              ))}
          </div>
      </Fragment>
  )
}
Post.propTypes = {
    getPosts:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
    

}
const mapStateToProps=state=>({
    post:state.post
})

export default connect(mapStateToProps,{getPosts})(Post) 
