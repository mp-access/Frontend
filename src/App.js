import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import './App.css';
import Welcome from './Welcome';
import Secured from './Secured';


class App extends Component {
    render() {
        console.log(process.env);
        return (

            <BrowserRouter>
                <div className="container">
                    <ul>
                        <li><Link to="/">public component</Link></li>
                        <li><Link to="/secured">secured component</Link></li>
                    </ul>
                    <Route exact path="/" component={Welcome}/>
                    <Route path="/secured" component={Secured}/>
                </div>
            </BrowserRouter>
        );
    }
}


export default App;
