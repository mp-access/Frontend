import React from 'react';
import { Assignment, Code, Courses, Course, Exercise, Profile, Welcome } from '../pages/';
import { Route } from 'react-router-dom';
import { withAuth } from '../auth/AuthProvider';
import Choice from '../pages/Choice';

const AppNavigation = () => {

    return (
        <>
            <Route exact path="/" component={Welcome}/>
            <PrivateRoute exact path="/courses" component={Courses}/>
            <PrivateRoute exact path="/courses/:courseId" component={Course}/>
            <PrivateRoute exact path="/courses/:courseId/assignments/:assignmentId" component={Assignment}/>
            <PrivateRoute exact path="/exercises/:exerciseId" component={Exercise}/>
            <PrivateRoute exact path="/code" component={Code}/>
            <PrivateRoute exact path="/profile" component={Profile}/>
            <PrivateRoute exact path="/choice" component={Choice}/>
        </>
    );
};

const PrivateRoute = withAuth(({ context, component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                // Check first if keycloak is initialized (might happen after logging, once the user is redirected to the app!)
                if (context.isInitialized) {
                    if (!context.isAuthenticated) {
                        context.login();
                        return;
                    }

                    return <Component {...props} />;
                } else {
                    // Show spinner maybe...
                    return <span>Loading</span>;
                }

            }
            }
        />
    );
});

export default AppNavigation;