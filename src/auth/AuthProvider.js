import React, { Component } from 'react';
import Keycloak from 'keycloak-js';

const AuthContext = React.createContext({
    isAuthenticated: false,
    keycloak: null,
});

class AuthProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isInitialized: false,
            keycloak: null,
            isAuthenticated: false,
        };

        const keycloak = Keycloak('/keycloak.json');
        keycloak.init({ onLoad: 'check-sso' })
            .success(authenticated => {
                this.setState({
                    isInitialized: true,
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

    render() {
        const { keycloak, isAuthenticated } = this.state;
        const { children } = this.props;

        return (
            <AuthContext.Provider value={
                {
                    keycloak,
                    isAuthenticated,
                    login: this.login,
                    logout: this.logout,
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

export { withAuth, AuthProvider };