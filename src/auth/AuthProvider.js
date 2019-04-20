import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import { withRouter } from 'react-router-dom';
import { canBypassLogin } from '../utils';

const AuthContext = React.createContext({
    isAuthenticated: false,
    keycloak: null,
});

class AuthProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            keycloak: null,
            isAuthenticated: false,
        };

        const keycloak = Keycloak('/keycloak.json');
        keycloak.init({ onLoad: 'check-sso' })
            .success(authenticated => {
                this.setState({
                    isAuthenticated: authenticated,
                    keycloak: keycloak,
                });
            })
            .error(err => console.log(err));
    }

    login = () => {
        this.state.keycloak.login();
    };

    logout = () => {
        this.state.keycloak.logout();
    };

    accountManagement = () => this.state.keycloak.accountManagement();

    loadUserInfo = () => {
        return this.state.keycloak.loadUserInfo();
    };

    authorizationHeader = () => {
        const { keycloak } = this.state;
        if (!keycloak) {
            return {};
        }

        return {
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
            },
        };
    };


    render() {
        const { keycloak, isAuthenticated } = this.state;
        const { children } = this.props;

        return (
            <AuthContext.Provider value={
                {
                    isInitialized: !!keycloak,
                    isAuthenticated: isAuthenticated,
                    login: this.login,
                    logout: this.logout,
                    accountManagement: this.accountManagement,
                    loadUserInfo: this.loadUserInfo,
                    authorizationHeader: this.authorizationHeader,
                }
            }>
                {children}
            </AuthContext.Provider>
        );
    }
}

const withAuth = Component => {
    return props => (
        <AuthContext.Consumer>
            {context => <Component {...props} context={context}/>}
        </AuthContext.Consumer>
    );
};

const withAuthAndRouter = Component => withAuth(withRouter(Component));

export { withAuth, withAuthAndRouter, AuthProvider };