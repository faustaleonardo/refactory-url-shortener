import axios from 'axios';
import {
  FETCH_USER,
  LOGIN,
  SIGNUP,
  LOGOUT,
  GET_ERROR,
  CLEAR_ERROR
} from './types';

const postUser = (url, data, type) => async dispatch => {
  try {
    let user = '';

    const response = await axios.post(url, data);
    if (response.data.status === 'success') user = response.data.data.user;

    dispatch({ type, payload: user });
  } catch (err) {
    dispatch({ type: GET_ERROR, payload: err.response.data.message });
  }
};

export const fetchUser = () => async dispatch => {
  const response = await axios.get('/api/auth/user');
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const login = data => postUser('/api/auth/login', data, LOGIN);

export const signup = data => postUser('/api/auth/signup', data, SIGNUP);

export const clearError = () => {
  return { type: CLEAR_ERROR, payload: null };
};
