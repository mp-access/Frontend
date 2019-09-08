import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter } from '../auth/AuthProvider';

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

            <nav className="navbar navbar-expand-lg bg-white">
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

                        {userInfo &&
                        <li className="nav-item">
                            {userInfo['preferred_username']}
                        </li>
                        }
                    </ul>

                    <form className="form-inline my-2 my-lg-0">
                        <LoginOrLogoutBtn isAuthenticated={isAuthenticated} login={login} logout={logout}
                                          history={history}/>
                    </form>

                </div>
            </nav>

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

export default withAuthAndRouter(Header);