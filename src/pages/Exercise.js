import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import CodeExercise from '../components/exercise/CodeExercise';
import CodeSnippetExercise from '../components/exercise/CodeSnippetExercise';
import VersionList from '../components/exercise/VersionList';
import ExerciseList from '../components/ExerciseList';
import TextExercise from '../components/text/TextExercise';
import ChoiceExercise from '../components/choice/ChoiceExercise';
import Workspace from '../models/Workspace';
import SubmissionService from '../utils/SubmissionService';

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
            exercises: [],
            workspace: Workspace,
        };
    }

    componentDidMount = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader();

        const exercise = await this.fetchExercise(exerciseId, authorizationHeader);
        const assignment = await this.fetchExerciseList(exercise, authorizationHeader);

        const submission = await this.fetchLastSubmission(exerciseId, authorizationHeader);
        const workspace = new Workspace(exercise, submission);
        
        this.setState({ 
            exercise, 
            exercises: assignment.exercises,
            workspace,
        });

        console.log("Initial", workspace);
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.match.params.exerciseId !== this.props.match.params.exerciseId) {
            const exerciseId = this.props.match.params.exerciseId;
            const authorizationHeader = this.props.context.authorizationHeader();

            const exercise = await this.fetchExercise(exerciseId, authorizationHeader);
            const assignment = await this.fetchExerciseList(exercise, authorizationHeader);

            const submission = await this.fetchLastSubmission(exerciseId, authorizationHeader);
            const workspace = new Workspace(exercise, submission);
            
            this.setState({ 
                exercise, 
                exercises: assignment.exercises,
                workspace,
            });
            console.log("Update", workspace);
        }
    }

    fetchExercise = (exerciseId, authHeader) => {
        return CourseDataService.getExercise(exerciseId, authHeader)
            .catch(err => console.error(err));
    };

    fetchExerciseList = (exercise, authHeader) => {
        return CourseDataService.getAssignment(exercise.courseId, exercise.assignmentId, authHeader)
            .catch(err => console.error(err));
    };

    fetchLastSubmission = (exerciseId, authHeader) => {
        return SubmissionService.getLastSubmission(exerciseId, authHeader)
            .catch(err => console.error(err));
    };

    fetchSubmissionById = (submissionId, authHeader) => {
        return SubmissionService.getSubmission(submissionId, authHeader)
            .catch(err => console.error(err));
    };


    loadSubmissionById = (submissionId) => {
        const authorizationHeader = this.props.context.authorizationHeader();
        const submission = this.fetchSubmissionById(submissionId, authorizationHeader);
        console.log("prev", this.state.workspace.submission.id);
        
        let newWorkspace = Object.assign({}, this.state.workspace);
        newWorkspace.submission = submission;
        this.setState({workspace: newWorkspace});

        console.log("post", this.state.workspace.submission.id);
    };


    submit = async () => {
        const publicFiles = this.refs.child.getPublicFiles();        

        console.log("prev", this.state.workspace);

        let newWorkspace = Object.assign({}, this.state.workspace);
        newWorkspace.publicFiles = publicFiles;
        this.setState({workspace: newWorkspace});

        console.log("post", this.state.workspace);


        let { workspace } = this.state;
        const authorizationHeader = this.props.context.authorizationHeader();

        let codeResponse = await SubmissionService.submitCode(workspace.exerciseId, workspace, authorizationHeader)
            .catch(err => console.error(err));

        console.log(codeResponse)
        const intervalId = setInterval(async () => {
            let evalResponse = await SubmissionService.checkEvaluation(codeResponse.evalId, authorizationHeader);
            if ('ok' === evalResponse.status) {
                const submissionId = evalResponse.submission;
                console.debug(submissionId);
                clearInterval(intervalId);

                const myheaders = {
                    headers: {...authorizationHeader},
                }
                
                const submission = await this.fetchSubmissionById(submissionId, myheaders);
                const workspace = new Workspace(this.state.workspace.exercise, submission);

                this.setState({
                    workspace
                });
            }
        }, 100);
    };

    renderMainExerciseArea(exercise, authorizationHeader, workspace) {
        let content = <p>unknown exercise type</p>;
        if (exercise.type === 'code') {
            content = 
                <CodeExercise
                    key={exercise.id}
                    ref="child"
                    exercise={exercise}
                    authorizationHeader={authorizationHeader}
                    workspace={workspace}
                />;
        } else if (exercise.type === 'codeSnippet') {
            content =
                <CodeSnippetExercise
                    key={exercise.id}
                    ref="child"
                    exercise={exercise}
                    authorizationHeader={authorizationHeader}
                    workspace={workspace}
                />;
        } else if (exercise.type === 'text'){
            content =
                <TextExercise
                    key={exercise.id}
                    ref="child"
                    exercise={exercise}
                />
        } else if (exercise.type === 'multipleChoice') {
            content = 
                <ChoiceExercise
                    key={exercise.id}
                    ref="child"
                    exercise={exercise}
                    authorizationHeader={authorizationHeader}
                />;
        }
        return content;
    }

    render() {
        const { exercise, exercises, workspace } = this.state;

        if (!exercise) {
            return null;
        }

        const submissionid = workspace.submission ? workspace.submission.id : undefined;

        const authorizationHeader = this.props.context.authorizationHeader();
        const content = this.renderMainExerciseArea(exercise, authorizationHeader, workspace);
        const versionList = <VersionList exercise={exercise} authorizationHeader={authorizationHeader}
                                         submit={this.submit} selectedSubmissionId={submissionid}
                                         changeSubmissionById={this.loadSubmissionById}/>;

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