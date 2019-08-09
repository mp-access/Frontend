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
            const keycloakJson = utils.isDevelopment ? '/keycloak.json' : '/keycloak-prod.json';
            const keycloak = Keycloak(keycloakJson);
            keycloak.init({ onLoad: 'check-sso' })
                .success(authenticated => {
                    this.setState({
                        isAuthenticated: authenticated,
                        keycloak: keycloak,
                    });
                })
                .error(err => console.log(err));
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
                this.state.keycloak.loadUserInfo().success(userInfo => resolve(userInfo));
            });
        }
    };

    authorizationHeader = () => {
        const { keycloak } = this.state;
        if (!keycloak) {
            return {};
        }

        return {
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
                'Content-Type': 'application/json',
            },
        };
    };

    accessToken = () => {
        const { keycloak } = this.state;
        if (!keycloak) {
            return '';
        }
        return keycloak.token;
    };

    allowedAccessToCourses = () => {
        const { keycloak } = this.state;
        let groupStrings = keycloak.tokenParsed.groups || [];
        groupStrings = groupStrings.map(el => el.split('/').filter(Boolean));

        const groups = {};
        groupStrings.forEach(course => {
            groups[course[0]] = {
                group: course[1],
                isAdmin: course[1] === 'authors',
            };
        });

        return groups;
    };

    isCourseAssistant = (courseTitle) => {
        const courseAccess = this.allowedAccessToCourses()[courseTitle];
        return !!courseAccess && courseAccess.isAdmin;
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
                    accessToken: this.accessToken,
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