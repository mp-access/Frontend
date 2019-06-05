import React, {Component} from 'react';
import {withAuth} from "../auth/AuthProvider";
import CourseDataService from "../utils/CourseDataService";
import AssignmentList from "../components/AssignmentList";

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
        const { context } = this.props;
        (async () => {
            CourseDataService.getCourses(context.authorizationHeader)
                .then(res => res.json())
                .then(
                    result => this.setState({course: result.filter(c => c.id === courseId)[0]})
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
                <h2>{this.state.course.title}</h2>

                <div>
                    <p>description: {this.state.course.description}</p>
                    <p>from: {this.state.course.startDate} - to: {this.state.course.endDate}</p>
                </div>

                <div>
                    <AssignmentList courseId={this.state.course.id} assignments={this.state.course.assignments} />
                </div>
            </div>
        );
    }
}

export default withAuth(Course);