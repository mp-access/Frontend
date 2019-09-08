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

    const name = !!userInfo ? userInfo['preferred_username'] : '';
    return (
        <header id={'header'}>
            <div className="h-flex">
                <Link className="logo" to="/">
                    <img src="/logo.png" alt="logo"/>
                </Link>

                <div className="d-flex">
                    <Link className="nav-link" to="/profile"><User size={14}/> {name}</Link>
                    <span className="p-1"/>
                    <form>
                        <LoginOrLogoutBtn isAuthenticated={isAuthenticated} login={login} logout={logout}
                                          history={history}/>
                    </form>
                </div>
            </div>
        </header>
    );
};

const LoginOrLogoutBtn = withAuthAndRouter(({ isAuthenticated, login, logout, history }) => {
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
        <LogIn size={14}/>Login
    </button>
);

const LogoutBtn = ({ onLogoutClick, history }) => (
    <button className="style-btn warn" onClick={(e) => {
        e.preventDefault();
        history.push('/');
        onLogoutClick();
    }
    }>
        <LogOut size={14}/>Logout
    </button>
);

export default withAuthAndRouter(Header);