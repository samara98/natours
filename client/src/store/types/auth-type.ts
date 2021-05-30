export enum AuthType {
  AUTH_START = 'AUTH_START',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAIL = 'AUTH_FAIL',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
}

export interface AuthStartAction {
  type: AuthType.AUTH_START;
}

export interface AuthSuccessAction {
  type: AuthType.AUTH_SUCCESS;
  payload: {
    user: any;
  };
}

export interface AuthFailAction {
  type: AuthType.AUTH_FAIL;
  payload: {
    error: any;
  };
}

export interface AuthLogoutAction {
  type: AuthType.AUTH_LOGOUT;
}

export type AuthAction = AuthStartAction | AuthSuccessAction | AuthFailAction | AuthLogoutAction;
