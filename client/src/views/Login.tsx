import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { authAction } from '~/store/actions';
import { RootState } from '~/store/store';

const mapStateToProps = (state: RootState) => ({
  rsAuth: state.auth,
});

const mapDispatchToProps = {
  raAuthFetchLogin: authAction.authFetchLogin,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps & PropsFromRedux;

const Login: React.FC<Props> = (props) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setLoginForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.raAuthFetchLogin(loginForm);
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form onSubmit={handleLogin} className="form form--login">
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email address
            </label>
            <input
              type="email"
              className="form__input"
              id="email"
              name="email"
              // placeholder="you@example.com"
              placeholder="admin@natours.io"
              required
              value={loginForm.email}
              onChange={handleInput}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              type="password"
              className="form__input"
              id="password"
              name="password"
              // placeholder="••••••••"
              placeholder="pass1234"
              required
              minLength={8}
              value={loginForm.password}
              onChange={handleInput}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default connector(Login);
