import React, { Component } from 'react';
import CourseDataService from '../utils/CourseDataService';
import ExerciseList from '../components/ExerciseList';
import ResultService from '../utils/ResultService';
import { ErrorRedirect } from './ErrorPage';
import { withBreadCrumbsAndAuth } from '../components/BreadCrumbProvider';
import { FromToDateTime } from '../components/DateTime';


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
                .then(result => {
                        this.setState({ assignment: result, isLoadingAssignment: false });
                        this.props.crumbs.setBreadCrumbs(result.breadCrumbs);
                    },
                )
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

    componentWillUnmount() {
        this.props.crumbs.setBreadCrumbs([]);
    }

    render() {
        const { assignment, assignmentScore, isLoadingAssignment } = this.state;

        if (!assignment || !assignmentScore) {
            if (!isLoadingAssignment && !assignment) {
                return <ErrorRedirect logs={{ stack: 'No assignment found' }}/>;
            }
            return null;
        }

        const gradedSubmissions = assignmentScore.gradedSubmissions ? assignmentScore.gradedSubmissions : [];

        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h2>{assignment.title}</h2>
                        <FromToDateTime fromDateTime={assignment.publishDate}
                                        toDateTime={assignment.dueDate}
                                        toAppend={true}/>
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

export default withBreadCrumbsAndAuth(Assignment);