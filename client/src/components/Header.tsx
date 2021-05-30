import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { authAction } from '~/store/actions';

import { RootState } from '~/store/store';

const mapStateToProps = (state: RootState) => ({
  rsAuth: state.auth,
});

const mapDispatchToProps = {
  raAuthFetchLogout: authAction.authFetchLogout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Header: React.FC<Props> = (props) => {
  const handleLogout: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    props.raAuthFetchLogout();
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>{' '}
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {props.rsAuth.user ? (
          <>
            <Link to="#!" className="nav__el nav__el--logout" onClick={handleLogout}>
              Log out
            </Link>
            <Link to="/me" className="nav__el">
              <img
                src={`/img/users/${props.rsAuth.user.photo}`}
                alt={`Pic of ${props.rsAuth.user.name}`}
                className="nav__user-img"
              />
              <span>{props.rsAuth.user.name!.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__el">
              Log In
            </Link>
            <Link to="#!" className="nav__el nav__el--cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default connector(Header);
