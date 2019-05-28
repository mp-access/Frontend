import React from 'react';
import {Link} from 'react-router-dom';
import {withAuthAndRouter} from '../auth/AuthProvider';

const Header = () => {
    return (
        <header style={{background: 'lightblue'}}>

            <nav className="navbar navbar-expand-lg bg-white">
                <Link className="navbar-brand" to="/">
                    <img src="/uzh_logo_d_pos_web_main.jpg"  alt="some text" class="d-inline-block align-top"/>
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                        </li>
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

const LoginOrLogoutBtn = withAuthAndRouter(({context, history}) => {
    const {isAuthenticated, login, logout} = context;
    if (!isAuthenticated) {
        return <LoginBtn onLoginClick={login}/>;
    }

    return <LogoutBtn onLogoutClick={logout} history={history}/>;
});

const LoginBtn = ({onLoginClick}) => (
    <button onClick={onLoginClick}>
        Login
    </button>
);

const LogoutBtn = ({onLogoutClick, history}) => (
    <button onClick={() => {
        history.push('/');
        onLogoutClick();
    }
    }>
        Logout
    </button>
);

export default Header;