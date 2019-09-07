import React from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter } from '../auth/AuthProvider';

const Header = () => {
    return (
        <header id={"header"}>

            <nav className="navbar navbar-expand-lg" style={{background: '#000000'}}>
                <Link className="logo" to="/">
                    <img src="/logo.png" alt="logo"/>
                </Link>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/courses">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                    </ul>

                    <form className="form-inline my-2 my-lg-0">
                        <LoginOrLogoutBtn/>
                    </form>

                </div>
            </nav>

        </header>
    );
};

const LoginOrLogoutBtn = withAuthAndRouter(({ context, history }) => {
    const { isAuthenticated, login, logout } = context;
    if (!isAuthenticated) {
        return <LoginBtn onLoginClick={login}/>;
    }

    return <LogoutBtn onLogoutClick={logout} history={history}/>;
});

const LoginBtn = ({ onLoginClick }) => (
    <button onClick={(e) => {
        e.preventDefault();
        onLoginClick();
    }}>
        Login
    </button>
);

const LogoutBtn = ({ onLogoutClick, history }) => (
    <button onClick={(e) => {
        e.preventDefault();
        history.push('/');
        onLogoutClick();
    }
    }>
        Logout
    </button>
);

export default Header;