import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import {AuthProvider} from './auth/AuthProvider';
import AppNavigation from './Navigation/AppNavigation';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
    render() {
        return (
                <BrowserRouter>
                    <AuthProvider>
                        <main className="container-fluid">
                            <Header/>
                            <br/>
                            <AppNavigation/>
                            <br/>
                            <Footer/>
                        </main>
                    </AuthProvider>
                </BrowserRouter>
        );
    }
}


export default App;
