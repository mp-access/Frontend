import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '../utils';

class CourseServiceInfo extends Component {

    state = {
        response: '',
        authorities: [],
        resourceIds: [],
        isAdmin: false,
    };

    async componentDidMount() {
        const authorizationHeader = this.props.authorizationHeader();

        fetch(utils.courseServiceUrl + '/users', authorizationHeader)
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    return { status: response.status, message: response.statusText };
            })
            .then(json => {
                const state = {
                    authorities: json.authorities.map(role => role.authority),
                    resourceIds: json.oauth2Request.resourceIds,
                };

                this.setState(state);
            })
            .catch(err => {
                this.setState((state, props) => ({ response: err.toString() }));
            });

        try {
            const response = await fetch(utils.courseServiceUrl + '/users/admin', authorizationHeader);
            let isAdmin = response.ok;
            this.setState({ isAdmin });
        } catch (e) {
            this.setState({ isAdmin: false });
        }

    }

    render() {
        const { authorities, resourceIds, isAdmin } = this.state;
        return (
            <div className="course-service">
                <h2>Some demo responses from the backend</h2>

                {isAdmin && <p>Yay, admin!</p>}
                {!isAdmin && <p>Sorry, you are not an admin</p>}

                <p>Roles</p>
                <ul>
                    {authorities.map((role, index) => <li key={role}>{role}</li>)}
                </ul>

                <p>Resources</p>
                <ul>
                    {resourceIds.map(resource => <li key={resource}>{resource}</li>)}
                </ul>
            </div>
        );
    }
}

CourseServiceInfo.propTypes = {
    authorizationHeader: PropTypes.func.isRequired,
};

export default CourseServiceInfo;