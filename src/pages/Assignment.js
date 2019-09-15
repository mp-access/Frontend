import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import ExerciseList from '../components/ExerciseList';
import Util from '../utils/Util';
import ResultService from '../utils/ResultService';
import { Calendar } from 'react-feather';
import { ErrorRedirect } from './ErrorPage';

class Assignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignment: undefined,
            assignmentScore: undefined,
            isLoadingAssignment: true,
        };
    }

    componentDidMount() {
        const { context } = this.props;
        const { courseId, assignmentId } = this.props.match.params;

        try {
            CourseDataService.getAssignment(courseId, assignmentId, context.authorizationHeader)
                .then(result => this.setState({ assignment: result, isLoadingAssignment: false }))
                .catch(err => {
                    console.debug('Error:', err.toString());
                });

            ResultService.getCourseResults(courseId, context.authorizationHeader)
                .then(result => this.setState({
                    assignmentScore: result.find(r => r.assignmentId === assignmentId),
                }))
                .catch(err => {
                    console.debug('Error:', err.toString());
                });
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        const { assignment, assignmentScore, isLoadingAssignment } = this.state;

        if (!assignment || !assignmentScore) {
            if (!isLoadingAssignment && !assignment) {
                return <ErrorRedirect logs={{ stack: 'No assignment found' }}/>;
            }
            return null;
        }

        let gradedSubmissions = assignmentScore.gradedSubmissions ? assignmentScore.gradedSubmissions : [];

        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h2>{assignment.title}</h2>
                        <small><Calendar size={12}/> Open
                            from: <strong>{Util.timeFormatter(assignment.publishDate)}</strong> -
                            to: <strong>{Util.timeFormatter(assignment.dueDate)}</strong></small>
                    </div>
                    <p>{assignment.description}</p>
                    <br/>
                    <br/>
                    <div>
                        <ExerciseList exercises={assignment.exercises} gradedSubmissions={gradedSubmissions}
                                      showScore={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(Assignment);