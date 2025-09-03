import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../../action/post';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../../action/alert';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const navigate = useNavigate();

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      setPreview(null);
      setPreviewIsVideo(false);
      return;
    }
    setFile(f);
    const isVideo = f.type.startsWith('video');
    setPreviewIsVideo(isVideo);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (file) formData.append('media', file);

    try {
      await addPost(formData);
      setText('');
      setFile(null);
      setPreview(null);
      setPreviewIsVideo(false);
      setAlert('post is added', 'success');
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className='post-form-container'>
      <div className='post-form-card'>
        <form
          className='form'
          onSubmit={onSubmit}
          encType='multipart/form-data'
        >
          <div className='form-header'>
            <h2 className='form-title'>Create a New Post</h2>
            <button type='submit' className='btn btn-primary submit-btn'>
              Post
            </button>
          </div>

          <textarea
            name='text'
            cols='30'
            rows='4'
            placeholder='Write something interesting...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className='form-textarea'
          />

          {preview && (
            <div className='preview-box'>
              {previewIsVideo ? (
                <video src={preview} controls className='preview-media' />
              ) : (
                <img src={preview} alt='preview' className='preview-media' />
              )}
            </div>
          )}

          <div className='file-upload'>
            <input
              type='file'
              id='mediaUpload'
              name='media'
              accept='image/*,video/*'
              onChange={onFileChange}
              className='hidden-file-input'
            />
            <label htmlFor='mediaUpload' className='custom-file-btn'>
              Choose File
            </label>
            <span className='upload-text'>
              Choose image/video you want to upload
            </span>
            {file && <span className='file-name'>{file.name}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
