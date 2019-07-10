import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import CodeExercise from '../components/exercise/CodeExercise';
import CodeSnippetExercise from '../components/exercise/CodeSnippetExercise';
import VersionList from '../components/exercise/VersionList';
import ExerciseList from '../components/ExerciseList';
import TextExercise from '../components/text/TextExercise';
import ChoiceExercise from '../components/choice/ChoiceExercise';

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
            exercises: [],
            submissionId: undefined,
        };
    }

    componentDidMount = () => {
        this.fetchExerciseAndExerciseList()
            .catch(err => console.error(err));
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.exerciseId !== this.props.match.params.exerciseId) {
            this.fetchExerciseAndExerciseList()
                .catch(err => console.error(err));
        }
    }

    fetchExerciseAndExerciseList = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader();

        const exercise = await CourseDataService.getExercise(exerciseId, authorizationHeader);
        const assignment = await CourseDataService.getAssignment(exercise.courseId, exercise.assignmentId, authorizationHeader);
        this.setState({ exercise, exercises: assignment.exercises });
    };

    setSubmissionId = (submissionId) => {
        this.setState({ submissionId: submissionId });
    };


    submit = async () => {
        console.log('Top Submit clicked');
    };

    renderMainExerciseArea(exercise, authorizationHeader, submissionId) {
        let content = <p>unknown exercise type</p>;
        if (exercise.type === 'code') {
            content = <CodeExercise
                key={exercise.id}
                exercise={exercise}
                authorizationHeader={authorizationHeader}
                submissionId={submissionId}
                submit={sub => this.submit = sub}
            />;
        } else if (exercise.type === 'codeSnippet') {
            content =
                <CodeSnippetExercise
                    key={exercise.id}
                    exercise={exercise}
                    authorizationHeader={authorizationHeader}
                    submissionId={submissionId}
                    submit={sub => this.submit = sub}
                />;
        } else if (exercise.type === 'text'){
            content =
                <TextExercise
                    exercise={exercise}
                    />
        } else if (exercise.type === 'multipleChoice') {
            content = <ChoiceExercise
                exercise={exercise}
                authorizationHeader={authorizationHeader}
            />;
        }
        return content;
    }

    render() {
        const { exercise, exercises, submissionId } = this.state;

        if (!exercise) {
            return null;
        }

        const authorizationHeader = this.props.context.authorizationHeader();
        const content = this.renderMainExerciseArea(exercise, authorizationHeader, submissionId);
        const versionList = <VersionList exercise={exercise} authorizationHeader={authorizationHeader}
                                         submit={this.submit} submissionId={submissionId}
                                         changeSubmissionId={this.setSubmissionId}/>;

        return (
            <div className="row">
                <div className="col-sm-2">
                    <div className={'panel'}>
                        <h4>Exercise list</h4>
                        <ExerciseList exercises={exercises}/>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className={'panel'}>
                        {content}
                    </div>
                </div>
                <div className="col-sm-2">
                    <div className={'panel'}>
                        <h4>Versions</h4>
                        {versionList}
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(Exercise);