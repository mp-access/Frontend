import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';

class Login extends Component {
    render() {
        const { context } = this.props;
        return (
            <div className="Welcome">
                Login
            </div>
        );
    }
}

export default withAuth(Login);