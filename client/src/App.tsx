import React, { Suspense, useLayoutEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import { RootState } from './store/store';
import { authAction } from './store/actions';
import Home from './views/Index';
import NotFound from './views/_404';

const Login = React.lazy(() => {
  return import('./views/Login');
});
const Me = React.lazy(() => {
  return import('./views/Me');
});
const TourSlug = React.lazy(() => {
  return import('./views/tours/TourSlug');
});
const MyTours = React.lazy(() => {
  return import('./views/MyTours');
});

const mapStateToProps = (state: RootState) => ({
  rsAuth: state.auth,
});

const mapDispatchToProps = {
  raAuthFetchMe: authAction.authFetchMe,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const App: React.FC<Props> = ({ raAuthFetchMe, rsAuth }) => {
  const [loading, setLoading] = useState(true);

  useLayoutEffect(
    () => {
      raAuthFetchMe().then(() => {
        setLoading(() => false);
      });
      return () => {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Header />

      <Suspense fallback={<Loading />}>
        <Switch>
          <Route
            path="/login"
            exact
            render={(props) => {
              return !rsAuth.isLogin ? <Login {...props} /> : <Redirect to="/" />;
            }}
          />
          <Route
            path="/me"
            exact
            render={(props) => {
              return rsAuth.isLogin ? <Me {...props} /> : <Redirect to="/" />;
            }}
          />
          <Route path="/tour/:slug" exact component={TourSlug} />
          <Route
            path="/my-tours"
            exact
            render={(props) => {
              return rsAuth.isLogin ? <MyTours {...props} /> : <Redirect to="/" />;
            }}
          />
          <Route path="/404" exact component={NotFound} />
          <Route path="/" exact component={Home} />
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Suspense>

      <Footer />
    </Router>
  );
};

export default connector(App);
