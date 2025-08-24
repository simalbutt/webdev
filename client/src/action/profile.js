import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  PROFILE_LOADING,
  CLEAR_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILES,
  GET_REPOS,
  CLEAR_REPOS
} from './types';
// import { header } from 'express-validator';

//get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    dispatch({ type: PROFILE_LOADING });
    const res = await axios.get('/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};


//get all profiles
export const getallProfile = () => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });
    const res = await axios.get('/api/profile');
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get profile by id
export const getProfileById = (userid) => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });
    const res = await axios.get(`/api/profile/user/${userid}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    // Clear old repos before fetching new ones
    dispatch({ type: CLEAR_REPOS });

    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data, // array of repos
    });
  } catch (err) {
    // If user not found (404), return empty repos instead of throwing UI error
    if (err.response && err.response.status === 404) {
      dispatch({
        type: GET_REPOS,
        payload: [], // empty array
      });
    } else {
      // Other errors (e.g., server down)
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response ? err.response.statusText : 'Server Error',
          status: err.response ? err.response.status : 500,
        },
      });
    }
  }
};



//createprofile
export const Createprofile =
  (formdata, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        Headers: {
          'content-type': 'application/json',
        },
      };
      const res = await axios.post('/api/profile', formdata, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? 'profile updated' : 'profile created', 'success')
      );
      if (!edit) {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response ? err.response.statusText : 'Server Error';
      const errorStatus = err.response ? err.response.status : 500;

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: errorMsg, status: errorStatus },
      });
    }
  };

//add experience
export const addExperience = (formdata, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/experience', formdata, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience added', 'success'));

    navigate('/dashboard');
  } catch (err) {
    const errorMsg = err.response ? err.response.statusText : 'Server Error';
    const errorStatus = err.response ? err.response.status : 500;

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: errorMsg, status: errorStatus },
    });
  }
};

//add education
export const addEducation = (formdata, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/education', formdata, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education added', 'success'));

    navigate('/dashboard');
  } catch (err) {
    const errorMsg = err.response ? err.response.statusText : 'Server Error';
    const errorStatus = err.response ? err.response.status : 500;

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: errorMsg, status: errorStatus },
    });
  }
};

//delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//detete account and profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: DELETE_ACCOUNT });
      dispatch(setAlert('Your account has been permanantly deleted','success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

