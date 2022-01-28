import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import UserInfo from '../components/UserInfo';

class Profile extends Component {

    render() {
        const { context } = this.props;

        if (context.isAuthenticated) {
            return (
                <div className="container">
                    <div className="panel">
                        <div className="heading">
                            <h2>My Profile</h2>
                        </div>
                        <UserInfo loadUserInfo={context.loadUserInfo} accountManagement={context.accountManagement}/>
                    </div>
                </div>
            );
        }
    }
}

export default withAuth(Profile);