import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RootState } from '~/store/store';

const mapStateToProps = (state: RootState) => ({
  rsAuth: state.auth,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps & PropsFromRedux;

const NavItem: React.FC<{ link: string; text?: string; icon?: string; active?: boolean }> = ({
  link,
  text,
  icon,
  active,
}) => {
  return (
    <li className={`${active ? 'side-nav--active' : ''}`}>
      <Link to={`${link}`}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
        </svg>{' '}
        {text}
      </Link>
    </li>
  );
};

const Me: React.FC<Props> = (props) => {
  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="#!" text="Settings" icon="settings" active={true} />
            <NavItem link="/my-tours" text="My bookings" icon="briefcase" />
            <NavItem link="#!" text="My reviews" icon="star" />
            <NavItem link="#!" text="Billing" icon="credit-card" />
          </ul>
          {props.rsAuth.user?.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem link="#!" text="Manage tours" icon="map" />
                <NavItem link="#!" text="Manage users" icon="users" />
                <NavItem link="#!" text="Manage reviews" icon="star" />
                <NavItem link="#!" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
            <form className="form form-user-data">
              <div className="form__group">
                <label htmlFor="name" className="form__label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form__input"
                  value={`${props.rsAuth.user?.name}`}
                  required
                  name="name"
                />
              </div>
              <div className="form__group ma-bt-md">
                <label htmlFor="email" className="form__label">
                  Email address
                </label>
                <input
                  type="text"
                  id="email"
                  className="form__input"
                  value={`${props.rsAuth.user?.email}`}
                  required
                  name="email"
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  src={`/img/users/${props.rsAuth.user?.photo}`}
                  alt="User pic"
                  className="form__user-photo"
                />
                <input
                  type="file"
                  id="photo"
                  className="form__upload"
                  accept="image/*"
                  name="photo"
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green">Save settings</button>
              </div>
            </form>
          </div>
          <div className="line">&nbsp;</div>
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-password">
              <div className="form__group">
                <label htmlFor="password-current" className="form__label">
                  Current password
                </label>
                <input
                  type="password"
                  id="password-current"
                  className="form__input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group">
                <label htmlFor="password" className="form__label">
                  New password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form__input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label htmlFor="password-confirm" className="form__label">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="password-confirm"
                  className="form__input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green btn--save-password">
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default connector(Me);
