import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools({
        // Specify name here, actionsBlacklist, actionsCreators and other options if needed
      })
    : compose;

export const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducers>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
