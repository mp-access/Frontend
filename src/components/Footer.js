import React from 'react';
import info from '../../package.json';
import Util from '../utils/Util';

const Footer = () => (
    <footer id={"footer"}>
        <div className={"container-fluid"}>
            <div className="row">
                <div className="col-6">
                    <small>© 2019 ACCESS</small>
                    <br/>
                    <small>With <span role="img" aria-label="Heart">❤️</span> by <a target="_blank" rel="noopener noreferrer" href="https://github.com/mp-access">ACCESS-Team</a></small>
                </div>
                <div className="col-6">
                    <div className="float-right">
                        <div><small>Frontend: <strong>{info.version}</strong></small></div>
                        <div><small>Backend: <strong>{Util.serverInfo().version}</strong></small></div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;