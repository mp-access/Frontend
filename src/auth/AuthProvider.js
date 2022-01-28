import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import { withRouter } from 'react-router-dom';
import utils from '../utils';

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
    }

    componentDidMount() {
        if (!utils.canBypassLogin) {
            const keycloak = Keycloak('/keycloak.json');

            keycloak.onTokenExpired = () => {
                keycloak
                    .updateToken(10)
                    .then((refreshed) => {
                        if (refreshed) {
                            console.debug('Access token refreshed');
                        } else {
                            console.debug('No need to refresh token');
                        }
                    }).catch(() => {
                    console.debug('Session expired');
                    keycloak.clearToken();
                });
            };

            keycloak.init({ onLoad: 'login-required' })
                .then(authenticated => {
                    this.setState({
                        isAuthenticated: authenticated,
                        keycloak: keycloak,
                    });
                })
                .catch(err => console.error(err));
        } else {
            this.setState({ isAuthenticated: true, keycloak: {} });
        }
    }

    login = () => {
        this.state.keycloak.login();
    };

    logout = () => {
        this.state.keycloak.logout();
    };

    onLogout = (cb) => {
        const { keycloak } = this.state;
        if (keycloak) {
            keycloak.onAuthLogout = () => cb();
        }
    };

    accountManagement = () => this.state.keycloak.accountManagement();

    loadUserInfo = async () => {
        if (utils.canBypassLogin) {
            return new Promise((resolve, reject) => {
                resolve({
                    name: 'Thor',
                    email: 'thor@asgard.galaxy',
                    sub: '12345678',
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.state.keycloak.loadUserInfo().then(userInfo => resolve(userInfo));
            });
        }
    };

    authorizationHeader = () => {
        const { keycloak } = this.state;
        if (!keycloak) {
            return {};
        }

        // Check if the token will expire in the next 30 seconds and update it if needed
        keycloak.updateToken(30);

        return {
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
                'Content-Type': 'application/json',
            },
        };
    };

    userId = () => {
        const { keycloak } = this.state;
        if (!keycloak) {
            return '';
        }
        return keycloak.subject;
    };

    isCourseAssistant = () => {
        return this.state.keycloak.realmAccess.roles.includes('assistant');
    };

    isCourseAdmin = () => {
        return this.state.keycloak.realmAccess.roles.includes('course-admin');
    };

    render() {
        const { keycloak, isAuthenticated } = this.state;
        const { children } = this.props;

        return (
            <AuthContext.Provider value={
                {
                    isInitialized: !!keycloak,
                    isAuthenticated: isAuthenticated,
                    isCourseAssistant: this.isCourseAssistant,
                    isCourseAdmin: this.isCourseAdmin,
                    userId: this.userId,
                    login: this.login,
                    logout: this.logout,
                    onLogout: this.onLogout,
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