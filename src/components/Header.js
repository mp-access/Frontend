import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuthAndRouter, withAuth } from '../auth/AuthProvider';
import { LogIn, LogOut, User } from 'react-feather';

class Header extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: ''
        };
    }

    componentDidMount() {
        const {context} = this.props;
        if(context.isAuthenticated){
            context.loadUserInfo().then(userInfo => {
                console.log("userInfo", userInfo);
                this.setState({ name: userInfo.name, email: userInfo.email});
            });
        }
    }

    render() {
        const {name} = this.state;

        return(
            <header id={"header"}>
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
            </header>
        );
    }
};

const LoginOrLogoutBtn = withAuthAndRouter(({ context, history }) => {
    const { isAuthenticated, login, logout } = context;
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

export default withAuth(Header);