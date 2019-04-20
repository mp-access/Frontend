import React from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter } from '../auth/AuthProvider';

const Header = () => {
    return (
        <header style={{ background: 'lightblue' }}>
            <h1>Welcome</h1>

            <LoginOrLogoutBtn/>

            <ul>
                <li><Link to="/">public component</Link></li>
                <li><Link to="/secured">secured component</Link></li>
            </ul>
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
    <button onClick={onLoginClick}>
        Login
    </button>
);

const LogoutBtn = ({ onLogoutClick, history }) => (
    <button onClick={() => {
        history.push('/');
        onLogoutClick();
    }
    }>
        Logout
    </button>
);

export default Header;