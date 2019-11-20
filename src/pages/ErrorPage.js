import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';

class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    };

    render() {
        const logs = this.props.logs ? this.props.logs : { stack: 'No details available.' };

        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h2>Error</h2>
                    </div>
                    <p>Sorry, something went wrong. Please refresh the page or try again later.</p>
                    <br/>
                    <button className="style-btn ghost"
                            onClick={this.toggleOpen}
                            aria-controls="more-info"
                            aria-expanded={this.state.open}
                    >
                        Show more info
                    </button>

                    <Collapse in={this.state.open}>
                        <div id="more-info">
                            <br/>
                            <pre>
                            {logs.stack}
                        </pre>
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }
}

export default ErrorPage;