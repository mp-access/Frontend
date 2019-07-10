import React, { Component } from 'react';
import './Logger.css';

class Logger extends Component {
    render(){
        return(
            <div id="logger">
                <div className="logger-section">
                    <h6>Console Output</h6>
                    <span className="log">{this.props.log }</span>
                </div>
                <div className="logger-section">
                    <h6>Testsuite Output</h6>
                    <span className="err">{this.props.err}</span>
                </div>
            </div>
        );
    }
};

export default Logger;