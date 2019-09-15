import React from 'react';
import { withRouter } from 'react-router-dom';
import { ErrorRedirect } from '../pages/ErrorPage';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorDetails: '' };

        const { history } = this.props;
        history.listen((location, action) => {
            if (this.state.hasError) {
                this.setState({
                    hasError: false,
                });
            }
        });
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorDetails: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        const errInfo = this.state.errorDetails;

        if (this.state.hasError) {
            debugger
            return <ErrorRedirect logs={errInfo} />
            //
            // return <Redirect to={{
            //     pathname: '/error',
            //     state: {logs: errInfo}
            // }}/>;
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);