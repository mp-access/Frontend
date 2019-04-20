import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import UserInfo from '../UserInfo';
import CourseServiceInfo from '../CourseServiceInfo';

class Secured extends Component {

    render() {
        const { context } = this.props;
        const { keycloak } = context;
        if (context.isAuthenticated) {
            return (
                <div>
                    <p>This is a Keycloak-secured component of your application. You shouldn't be able
                        to see this unless you've authenticated with Keycloak.</p>

                    <UserInfo keycloak={keycloak}/>


                    <button onClick={() => keycloak.accountManagement()}>Account management</button>

                    <CourseServiceInfo keycloak={keycloak}/>
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