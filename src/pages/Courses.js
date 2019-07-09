import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseBanner from '../components/CourseBanner';
import CourseDataService from '../utils/CourseDataService';

class Courses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        };
    }

    componentDidMount() {
        const { context } = this.props;

        CourseDataService.getCourses(context.authorizationHeader())
            .then(result => this.setState({ courses: result }))
            .catch(err => {
                console.debug('Error:', err.toString());
            });
    }

    render() {
        const listItems = this.state.courses.map((c) =>
            <div className="col-sm-3" key={c.id}>
                <CourseBanner course={c}/>
            </div>,
        );

        return (
            <div className="container">
                <h2>My Courses</h2>
                <div className="row">
                    {listItems}
                </div>
            </div>
        );
    }

}

export default withAuth(Courses);