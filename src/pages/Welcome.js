import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';

class Welcome extends Component {
    render() {
        const { context } = this.props;
        return (
            <div className="Welcome">
                <p>
                  Hello Welcome to Access
                </p>

                {!context.isAuthenticated &&
                <p>Login to view your courses.</p>
                }

            </div>
        );
    }
}

export default withAuth(Welcome);