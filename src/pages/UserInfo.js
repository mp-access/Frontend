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
        this.props.loadUserInfo().success(userInfo => {
            this.setState({ name: userInfo.name, email: userInfo.email, id: userInfo.sub });
        });
    }

    render() {
        const { id, name, email } = this.state;
        return (
            <div>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>ID: {id}</p>
            </div>
        );
    }
}

export default UserInfo;