import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import UserInfo from '../components/UserInfo';
import CourseServiceInfo from '../components/CourseServiceInfo';

class Secured extends Component {

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

                    <CourseServiceInfo authorizationHeader={context.authorizationHeader}/>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Unable to authenticate!</p>
                    <button onClick={() => context.login()}>Login</button>
                </div>
            );
        }
    }
}

export default withAuth(Secured);