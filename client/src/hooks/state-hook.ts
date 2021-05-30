import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppDispatch, RootState } from '~/store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppActions = <A, C extends ActionCreatorsMapObject<A>>(actionCreators: C): C => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};
