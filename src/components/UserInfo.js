import React, { Component } from 'react';

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            id: '',
        };
    }

    componentDidMount() {
        this.props.loadUserInfo().then(userInfo => {
            this.setState({ name: userInfo.name, email: userInfo.email, id: userInfo.sub });
        });
    }

    render() {
        const { id, name, email } = this.state;
        const { accessToken, accountManagement } = this.props;

        return (
            <div>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>ID: {id}</p>
                <p>Access token:</p>
                <pre>{accessToken()}</pre>

                <button onClick={accountManagement}>Account management</button>
            </div>
        );
    }
}

export default UserInfo;