import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import UserInfo from '../components/UserInfo';

class Profile extends Component {

    render() {
        const { context } = this.props;

        if (context.isAuthenticated) {
            return (
                <div>
                    <p>This is a Keycloak-secured component of your application. You shouldn't be able
                        to see this unless you've authenticated with Keycloak.</p>

                    <UserInfo loadUserInfo={context.loadUserInfo} accessToken={context.accessToken}
                              accountManagement={context.accountManagement}/>

                    <hr/>

                </div>
            );
        }
    }
}

export default withAuth(Profile);