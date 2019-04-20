import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Welcome from './pages/Welcome';
import Secured from './pages/Secured';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './auth/AuthProvider';


class App extends Component {
    render() {
        return (

            <BrowserRouter>
                <AuthProvider>
                    <div className="container">
                        <Header/>

                        <Route exact path="/" component={Welcome}/>
                        <Route path="/secured" component={Secured}/>

                        <Footer/>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        );
    }
}


export default App;
