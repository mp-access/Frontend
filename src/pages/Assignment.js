import React, {Component} from 'react';
import {withAuth} from "../auth/AuthProvider";
import CourseDataService from "../utils/CourseDataService";
import ExerciseList from "../components/ExerciseList";

class Assignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignment: undefined
        }
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        const assignmentId = this.props.match.params.assignmentId;
        const { context } = this.props;

        (async () => {
            CourseDataService.getAssignment(courseId, assignmentId, context.authorizationHeader())

                .then(res => res.json())
                .then(
                    result => this.setState({assignment: result})
                )
                .catch(err => {
                    console.debug("Error:", err.toString())
                });
        })();
    }

    render() {
        if (!this.state.assignment) {
            return null;
        }

        return (
            <div>
                <h2>{this.state.assignment.title}</h2>

                <div>
                    <p>description: {this.state.assignment.description}</p>
                    <p>from: {this.state.assignment.publishDate} - to: {this.state.assignment.dueDate}</p>
                </div>

                <div>
                    <ExerciseList exercises={this.state.assignment.exercises} />
                </div>
            </div>
        );
    }
}

export default withAuth(Assignment);