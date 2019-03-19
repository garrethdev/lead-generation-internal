import { push } from 'react-router-redux';
import authService from './services/auth.service';
import storage from '../helpers/storage';

export const USER_LOGIN = 'auth/USER_LOGIN';
export const USER_LOGOUT = 'auth/USER_LOGOUT';
export const USER_LOCAL_KEY = 'auth.user';

const initialState = {
  user: storage.getItem(USER_LOCAL_KEY) || null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      const { user } = action.payload;
      storage.setItem(USER_LOCAL_KEY, user);
      return {
        ...state,
        user
      };

    case USER_LOGOUT:
      storage.setItem(USER_LOCAL_KEY, null);
      storage.deleteAllCookies();
      return {
        ...state,
        user: null
      };

    default:
      return state;
  }
};

export const logInUser = credentials => dispatch => authService.loginUser(credentials)
  .then((user) => {
    dispatch({
      type: USER_LOGIN,
      payload: user
    });
    return user;
  });

export const logOutUser = () => (dispatch) => {
  dispatch(push('/login'));
  dispatch({
    type: USER_LOGOUT
  });
};
