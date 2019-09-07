import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './UserConsole.css';

class UserConsole extends Component {
    render(){
        return(
            <Tabs defaultActiveKey="console" id="uncontrolled-tab-example">
                <Tab eventKey="console" title="Console">
                    <div id="logger">
                        <div className="logger-section">
                            <h6>Console Output</h6><br/>
                            <span className="log">{this.props.log}</span>
                        </div> 
                    </div>
                </Tab>
                <Tab eventKey="tests" title="Tests">
                    <div id="logger" class="light">
                        <div className="logger-section">
                            <h6>Test Output</h6><br/>
                            <span className="">{this.props.err}</span>
                        </div> 
                    </div>
                </Tab>
             </Tabs>
        );
    }
};

export default UserConsole;