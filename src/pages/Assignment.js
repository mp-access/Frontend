import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import ExerciseList from '../components/ExerciseList';
import Util from '../utils/Util';

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
            <div className="container">
                <h2>{assignment.title}</h2>

                <div>
                    <p>{assignment.description}</p>
                    <small>Open from: <strong>{Util.timeFormatter(assignment.publishDate)}</strong> - to: <strong>{Util.timeFormatter(assignment.dueDate)}</strong></small>
                    <br /><br />
                </div>

                <div>
                    <ExerciseList exercises={assignment.exercises}/>
                </div>
            </div>
        );
    }
}

export default withAuth(Assignment);