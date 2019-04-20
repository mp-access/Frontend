import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <header>
        <ul>
            <li><Link to="/">public component</Link></li>
            <li><Link to="/secured">secured component</Link></li>
        </ul>
    </header>
);

export default Header;