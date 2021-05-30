import { AuthAction, AuthType } from '../types/auth-type';

interface AuthState {
  user: {
    _id?: string;
    __v?: number;
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    photo?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  error: any;
  loading: boolean;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: true,
  isLogin: false,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthType.AUTH_START:
      return { ...state, error: null, loading: true };
    case AuthType.AUTH_SUCCESS:
      return { ...state, user: action.payload.user, isLogin: true, error: null, loading: false };
    case AuthType.AUTH_FAIL:
      return { ...state, error: action.payload.error, loading: false };
    case AuthType.AUTH_LOGOUT:
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

export default authReducer;
