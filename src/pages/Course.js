import React, {Component} from 'react';
import {withAuth} from "../auth/AuthProvider";
import CourseDataService from "../utils/CourseDataService";

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: undefined
        }
        this.courseService = new CourseDataService();
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        this.lookupCurrentCourse(courseId);
    }

    lookupCurrentCourse(id) {
        this.courseService.getCourse(id).then(c => {
                this.setState({course: c});
            }
        );
    }

    render() {
        if (!this.state.course) {
            return null;
        }

        return (
            <div>
                <h2>{this.state.course.name}</h2>
                <p>id: {this.state.course.id}</p>
                <p>name: {this.state.course.name}</p>
            </div>
        );
    }
}

export default withAuth(Course);