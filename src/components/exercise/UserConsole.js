import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Terminal, CheckCircle } from 'react-feather';
import './UserConsole.css';

class UserConsole extends Component {

    render(){
        const {onBottomTab, currBottomTab} = this.props;

        return(
            <>
                <Tabs defaultActiveKey={currBottomTab} id="console-test-tab" onSelect={onBottomTab}>
                    <Tab eventKey="console" title="Console">
                        <div id="logger">
                            <div className="logger-section">
                                <h6><Terminal size={16} /> Console Output</h6><br/>
                                <span className="log">{this.props.log}</span>
                            </div> 
                        </div>
                    </Tab>
                    <Tab eventKey="tests" title={"Tests"}>
                        <div id="logger" className="light">
                            <div className="logger-section">
                                <h6><CheckCircle size={16} /> Test Output</h6><br/>
                                <span className="">{this.props.err}</span>
                            </div> 
                        </div>
                    </Tab>
                </Tabs>
             </>
        );
    }
};

export default UserConsole;