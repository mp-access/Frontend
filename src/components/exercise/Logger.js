import React, { Component } from 'react';
import './Logger.css';

class Logger extends Component {
    render(){
        return(
            <div id="logger">
                {this.props.log}
            </div>
        );
    }
};

export default Logger;