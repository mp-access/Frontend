import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import ExerciseList from '../components/ExerciseList';

class Assignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignment: undefined,
        };
    }

    componentDidMount() {
        const { context } = this.props;
        const { courseId, assignmentId } = this.props.match.params;

        CourseDataService.getAssignment(courseId, assignmentId, context.authorizationHeader())
            .then(result => this.setState({ assignment: result }))
            .catch(err => {
                console.debug('Error:', err.toString());
            });
    }

    render() {
        const { assignment } = this.state;

        if (!assignment) {
            return null;
        }

        return (
            <div>
                <h2>{assignment.title}</h2>

                <div>
                    <p>description: {assignment.description}</p>
                    <p>from: {assignment.publishDate} - to: {assignment.dueDate}</p>
                </div>

                <div>
                    <ExerciseList exercises={assignment.exercises}/>
                </div>
            </div>
        );
    }
}

export default withAuth(Assignment);