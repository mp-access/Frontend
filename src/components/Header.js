import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter } from '../auth/AuthProvider';
import { LogIn, LogOut, User, ChevronRight} from 'react-feather';
import { withBreadCrumbsAndAuthAndRouter } from './BreadCrumbProvider';

const Header = ({ history, context, crumbs }) => {
    const { isAuthenticated, login, logout, loadUserInfo } = context;
    const breadCrumbs = crumbs.breadCrumbs;
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadUserInfo().then(userInfo => setUserInfo(userInfo))
                .catch(error => console.debug(error));
        }
    }, [isAuthenticated]);

    const name = (!!userInfo && userInfo['given_name'] && userInfo['family_name']) ? (userInfo['given_name'] + " " + userInfo['family_name']) : 'My Profile';
    return (
        <header id={'header'}>
            <div className="h-flex">
                <Link className="logo" to="/">
                    <img src="/logo.png" alt="logo"/>
                </Link>

                {(breadCrumbs && breadCrumbs.length > 0 ) &&
                <nav>
                    <ul className="breadcrumbs">
                        {breadCrumbs.map( (item, index) =>
                            <li key={index}>
                                <Link className="nav-link" to={"/" + item.url}>{item.title}</Link>
                            </li>
                        ).reduce((prev, curr, index) => [prev, <li key={index * 20}><ChevronRight size={14} /></li>, curr])}
                    </ul>
                </nav>
                }

                <div className="d-flex">
                    <Link className="nav-link" to="/profile"><User size={16}/>{name}</Link>
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

export default withBreadCrumbsAndAuthAndRouter(Header);
