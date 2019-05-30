import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import MyCourses from '../components/MyCourses';

class Welcome extends Component {
    render() {
        const { context } = this.props;
        return (
            <div className="Welcome">
                <p>
                    This is your public-facing component.
                </p>

                {!context.isAuthenticated &&
                <p>Login to view your courses.</p>
                }

                {context.isAuthenticated &&
                <MyCourses authorizationHeader={context.authorizationHeader()}/>
                }
            </div>
        );
    }
}

export default withAuth(Welcome);