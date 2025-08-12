import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  USER_LOAD,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../action/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthanticated: null,
  loading: true,
  user: null,
};
export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthanticated: true,
        loading: false,
        // user: payload,
      };
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthanticated: false,
        loading: false,
        // user: null,
      };
    case USER_LOAD:
      return {
        ...state,
        isAuthanticated: true,
        loading: false,
        user: payload,
      };

    case AUTH_FAIL:
      return {
        ...state,
        token: null,
        isAuthanticated: false,
        loading: false,
      };

    default:
      return state;
  }
}
