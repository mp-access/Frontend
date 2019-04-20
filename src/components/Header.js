import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '../auth/AuthProvider';

const Header = ({ context }) => {
    const { isAuthenticated, login, logout } = context;
    return (
        <header style={{background: 'lightblue'}}>
            <h1>Welcome</h1>

            {isAuthenticated &&
            <button onClick={logout}>Logout</button>
            }

            {!isAuthenticated &&
            <button onClick={login}>Login</button>
            }

            <ul>
                <li><Link to="/">public component</Link></li>
                <li><Link to="/secured">secured component</Link></li>
            </ul>
        </header>
    );
};

export default withAuth(Header);