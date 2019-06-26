import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import {AuthProvider} from './auth/AuthProvider';
import AppNavigation from './Navigation/AppNavigation';


class App extends Component {
    render() {
        return (
                <BrowserRouter>
                    <AuthProvider>
                        <main>
                            <Header/>
                            <div id="content" className="container-fluid">
                                <AppNavigation/>
                            </div>
                            <Footer/>
                        </main>
                    </AuthProvider>
                </BrowserRouter>
        );
    }
}


export default App;
