import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter } from '../auth/AuthProvider';
import { LogIn, LogOut, User } from 'react-feather';

const Header = ({ history, context }) => {
    const { isAuthenticated, login, logout, loadUserInfo } = context;
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadUserInfo().then(userInfo => setUserInfo(userInfo))
                .catch(error => console.debug(error));
        }
    }, [isAuthenticated]);

    console.log('User info', userInfo);

    return (
        <header id={'header'}>
            <div className="h-flex">
                <Link className="logo" to="/">
                    <img src="/logo.png" alt="logo"/>
                </Link>

                <div className="d-flex">
                    <Link className="nav-link" to="/profile"><User size={14} /> {name}</Link>
                    <span className="p-1"></span>
                    <form>
                        <LoginOrLogoutBtn/>
                    </form>
                </div>
            </div>
            {/*<nav className="navbar navbar-expand-lg bg-white">*/}
            {/*    <Link className="logo" to="/">*/}
            {/*        <img src="/logo.png" alt="logo"/>*/}
            {/*    </Link>*/}

            {/*    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">*/}
            {/*        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">*/}
            {/*            <li className="nav-item">*/}
            {/*                <Link className="nav-link" to="/courses">Courses</Link>*/}
            {/*            </li>*/}
            {/*            <li className="nav-item">*/}
            {/*                <Link className="nav-link" to="/profile">Profile</Link>*/}
            {/*            </li>*/}
            {/*        </ul>*/}

            {/*        <form className="form-inline my-2 my-lg-0">*/}
            {/*            <LoginOrLogoutBtn/>*/}
            {/*        </form>*/}

            {/*    </div>*/}
            {/*</nav>*/}

        </header>
    );
};

const LoginOrLogoutBtn = withAuthAndRouter(({ isAuthenticated, login, logout, history }) => {
    // const {isAuthenticated, login, logout} = context;
    if (!isAuthenticated) {
        return <LoginBtn onLoginClick={login}/>;
    }

    return <LogoutBtn onLogoutClick={logout} history={history}/>;
});

const LoginBtn = ({ onLoginClick }) => (
    <button className="style-btn" onClick={(e) => {
        e.preventDefault();
        onLoginClick();
    }}>
        <LogIn size={14} />Login
    </button>
);

const LogoutBtn = ({ onLogoutClick, history }) => (
    <button className="style-btn warn" onClick={(e) => {
        e.preventDefault();
        history.push('/');
        onLogoutClick();
    }
    }>
        <LogOut size={14} />Logout
    </button>
);

export default withAuthAndRouter(Header);