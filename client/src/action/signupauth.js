import axios from 'axios';
import { setAlert } from './alert';
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  USER_LOAD,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setauthtoken';

//load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOAD,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAIL,
    });
  }
};

//register user
export const registerUser =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('/api/user', body, config);
      dispatch({ type: SIGNUP_SUCCESS, payload: res.data });
      console.log(res.data);
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
      }
      dispatch({ type: SIGNUP_FAIL });
    }
  };

//login user
export const loginUser =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post('/api/auth', body, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      console.log(res.data);
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
      }
      dispatch({ type: LOGIN_FAIL });
    }
  };

//logout
export const logoutUser = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
  
};
