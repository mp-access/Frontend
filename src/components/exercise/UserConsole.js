import React, { Component } from 'react';
import './UserConsole.css';

class UserConsole extends Component {
    render(){
        return(
            <div id="logger">
                {/*<div className="logger-section">
                    <h6>Console Output</h6>
                    <span className="log">{this.props.log }</span>
                   </div>
                */}
                <div className="logger-section">
                    <span className="err">{this.props.err}</span>
                </div>
            </div>
        );
    }
};

export default UserConsole;