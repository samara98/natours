import { Dispatch } from 'redux';
import serverApi from '~/api/server-api';
import {
  AuthAction,
  AuthFailAction,
  AuthLogoutAction,
  AuthStartAction,
  AuthSuccessAction,
  AuthType,
} from '../types/auth-type';

export const authStart = (): AuthStartAction => {
  return {
    type: AuthType.AUTH_START,
  };
};

export const authSuccess = (user: any): AuthSuccessAction => {
  return {
    type: AuthType.AUTH_SUCCESS,
    payload: {
      user,
    },
  };
};

export const authFail = (error: any): AuthFailAction => {
  return {
    type: AuthType.AUTH_FAIL,
    payload: {
      error: error,
    },
  };
};

export const authLogout = (): AuthLogoutAction => {
  return {
    type: AuthType.AUTH_LOGOUT,
  };
};

// fetching

export const authFetchLogin = (loginForm: { email: string; password: string }) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch(authStart());
      const loginResponse = await serverApi.post('/api/v1/users/login', loginForm);
      dispatch(authSuccess(loginResponse.data.data.user));
    } catch (err) {
      dispatch(authFail(err));
    }
  };
};

export const authFetchLogout = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch(authStart());
      await serverApi.post('/api/v1/users/logout');
      dispatch(authLogout());
    } catch (err) {
      dispatch(authFail(err));
    }
  };
};

export const authFetchMe = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      dispatch(authStart());
      const getMeResponse = await serverApi.get('/api/v1/users/me');
      dispatch(authSuccess(getMeResponse.data.data));
    } catch (err) {
      dispatch(authFail(err));
    }
  };
};
