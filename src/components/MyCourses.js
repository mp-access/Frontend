import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '../utils';

class MyCourses extends Component {

    state = {
        courses: [],
        isLoading: false,
    };

    componentDidMount() {
        this.setState({ isLoading: true });

        this.fetchMyCourses()
            .then(() => this.setState({ isLoading: false }));
    }

    fetchMyCourses = async () => {
        const { authorizationHeader } = this.props;
        const response = await fetch(utils.courseServiceUrl + '/users/courses', authorizationHeader);
        if (response.ok) {
            const courses = await response.json();
            this.setState({ courses });
        }
    };

    render() {
        const { courses } = this.state;
        return (
            <div>
                <h2>
                    My courses
                </h2>
                <ul>
                    {courses.map((course) => <li key={course}>{course}</li>)}
                </ul>
            </div>
        );
    }
}

MyCourses.propTypes = {
    authorizationHeader: PropTypes.object.isRequired,
};

export default MyCourses;