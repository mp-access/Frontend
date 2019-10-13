import React from 'react';
import {version} from '../..//package.json';
import Util from '../utils/Util';

const Footer = () => (
    <footer id={"footer"}>
        <div className={"container-fluid"}>
            <div className="row">
                <div className="col-6">
                    <div>© 2019 ACCESS</div>
                    <small>with ❤️ by <a target="_blank" rel="noopener noreferrer" href="https://github.com/mp-access">ACCESS-team</a></small>
                </div>
                <div className="col-6">
                    <div className="float-right">
                        <div><small>Frontend: <strong>v{version}</strong></small></div>
                        <div><small>Backend: <strong>v{Util.serverInfo().version}</strong></small></div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;