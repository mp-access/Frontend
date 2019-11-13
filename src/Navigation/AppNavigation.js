import React from 'react';
import { Assignment, Course, Courses, Exercise, Profile } from '../pages/';
import { Switch, Redirect, Route } from 'react-router-dom';
import { withAuth } from '../auth/AuthProvider';
import Spinner from '../components/core/Spinner';
import ErrorBoundary from './ErrorBoundary';
import ErrorPage from '../pages/ErrorPage';
import PageNotFound from '../pages/PageNotFound';

const AppNavigation = () => (
    <>
        
        <Switch>
            <SafeRoute exact path="/" render={() => <Redirect to="/courses"/>}/>
            <PrivateRoute exact path="/courses" component={Courses}/>
            <PrivateRoute exact path="/courses/:courseId" component={Course}/>
            <PrivateRoute exact path="/courses/:courseId/assignments/:assignmentId" component={Assignment}/>
            <PrivateRoute exact path="/exercises/:exerciseId" component={Exercise}/>
            <PrivateRoute exact path="/profile" component={Profile}/>

            <SafeRoute exact path="/error" component={ErrorPage}/>
            <SafeRoute component={PageNotFound} />
        </Switch>
        
    </>
);

const PrivateRoute = withAuth(({ context, component: Component, ...rest }) => (
        <SafeRoute
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
                    return <div className="loading-box"><Spinner text={'Loading...'}/></div>;
                }
            }
            }
        />
    ),
);

/**
 * A route which does not crash if an error happens inside of it
 */
const SafeRoute = (props) => (
    <ErrorBoundary>
        <Route {...props} />
    </ErrorBoundary>
);

export default AppNavigation;