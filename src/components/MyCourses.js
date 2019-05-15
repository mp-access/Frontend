import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '../utils';

class MyCourses extends Component {

    state = {
        courses: [],
        selectedCourse: -1,
        isLoading: false,
    };

    componentDidMount() {
        this.setState({ isLoading: true });

        // this.fetchMyCourses()
        //     .then(() => this.setState({ isLoading: false }));

        const fakeCourses = [{
            "id": "31ee2054-cbbe-41bc-b5bf-98140cb46cb9",
            "title": "Informatics 2",
            "description": "Algodat + Modelling",
            "owner": "dr.prof@uzh.ch",
            "startDate": "2019-09-22T00:00:00.000+0000",
            "endDate": "2020-01-01T00:00:00.000+0000",
            "assignments": [
                {
                    "id": "c33cd07e-fe7d-4a5b-bc54-981bcb2a7055",
                    "title": "assignment1",
                    "description": "string manipulation lab",
                    "publishDate": "2001-12-15T00:00:00.000+0000",
                    "dueDate": "2001-05-11T00:00:00.000+0000",
                    "exercises": [
                        {
                            "id": "a4097b1f-b476-4c63-9911-8efacc61f4ea",
                            "type": "code",
                            "language": "python"
                        }
                    ]
                }
            ]
        }];
        this.setState({courses: fakeCourses});
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
                    {courses.map((course) => <li key={course.id}>{course.description}</li>)}
                </ul>
            </div>
        );
    }
}

MyCourses.propTypes = {
    authorizationHeader: PropTypes.object.isRequired,
};

export default MyCourses;