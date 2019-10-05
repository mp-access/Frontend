import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import { withRouter } from 'react-router-dom';

const BreadCrumbContext = React.createContext({
    breadCrumbs: [],
});

class BreadCrumbProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            breadCrumbs: [],
        };
    }

    setBreadCrumbs = (breadCrumbs) => {
        this.setState({breadCrumbs: breadCrumbs});
    }

    render(){ 
        const { children } = this.props;
        
        return(
            <BreadCrumbContext.Provider
                value={{
                    breadCrumbs: this.state.breadCrumbs,
                    setBreadCrumbs: this.setBreadCrumbs
                }}
            >
            {children}
          </BreadCrumbContext.Provider>
        );
    }
    
}

const withBreadCrumbs = Component => {
    return props => (
        <BreadCrumbContext.Consumer>
            {context => <Component {...props} crumbs={context}/>}
        </BreadCrumbContext.Consumer>
    );
};

const withBreadCrumbsAndAuthAndRouter = Component => withAuth(withRouter(withBreadCrumbs(Component)));
const withBreadCrumbsAndAuth = Component => withAuth(withBreadCrumbs(Component));

export { withBreadCrumbs, BreadCrumbProvider, withBreadCrumbsAndAuthAndRouter, withBreadCrumbsAndAuth };