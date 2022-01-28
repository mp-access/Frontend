import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import PageNotFound from '../pages/PageNotFound';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorDetails: '' };

        this.props.history.listen((location, action) => {
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
            if(this.state.errorDetails.message === "404"){
                return <Route render={() => <PageNotFound logs={errInfo} />} />
            }else{
                return <Route render={() => <ErrorPage logs={errInfo} />} />
            }
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);