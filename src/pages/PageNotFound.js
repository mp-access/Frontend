import React, { Component } from 'react';

class PageNotFound extends Component {

    render() {
        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h2>404 - Page not found</h2>
                    </div>
                    <p>Maybe you have a broken link? Or maybe the page was deleted because it had some shady contents... <br />Guess we'll never find out ¯\_(ツ)_/¯
</p>
                </div>
            </div>
        );
    }
}

export default PageNotFound;