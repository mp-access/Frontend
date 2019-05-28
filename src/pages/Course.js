import React, {Component} from 'react';
import {withAuth} from "../auth/AuthProvider";
import CourseDataService from "../utils/CourseDataService";

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            course: undefined
        }
        this.courseService = new CourseDataService();
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        (async () => {
            CourseDataService.getCourses()
                .then(res => res.json())
                .then(
                    result => this.setState({course: result.filter( c => c.id === courseId)[0]})
                )
                .catch(err => {
                    console.debug("Error:", err.toString())
                });
        })();
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