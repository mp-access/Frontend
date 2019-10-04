import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import { withRouter } from 'react-router-dom';

const BreadCrumbContext = React.createContext({
    breadCrumbs: [],
});

class BreadCrumbs extends Component {

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
            {context => <Component {...props} context={context}/>}
        </BreadCrumbContext.Consumer>
    );
};

const withBreadCrumbsAndAuthAndRouter = Component => withBreadCrumbs(withAuth(withRouter(Component)));
const withBreadCrumbsAndAuthr = Component => withBreadCrumbs(withAuth(Component));

export { withBreadCrumbs, BreadCrumbs, withBreadCrumbsAndAuthAndRouter, withBreadCrumbsAndAuthr };