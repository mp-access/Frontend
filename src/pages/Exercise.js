import React, { Component } from 'react';
import CourseDataService from '../utils/CourseDataService';
import CodeExercise from '../components/exercise/CodeExercise';
import CodeSnippetExercise from '../components/exercise/CodeSnippetExercise';
import VersionList from '../components/exercise/VersionList';
import ExerciseList from '../components/ExerciseList';
import TextExercise from '../components/text/TextExercise';
import ChoiceExercise from '../components/choice/ChoiceExercise';
import Workspace from '../models/Workspace';
import SubmissionService from '../utils/SubmissionService';
import Spinner from '../components/core/Spinner';
import { withAuth } from '../auth/AuthProvider';
import { Play, AlertCircle } from 'react-feather';
import { OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
            exercises: [],
            workspace: Workspace,
            runButtonState: false,
            isDark: false,
            currBottomTab: 'tests',
            showToast: true,
        };
        this.exerciseComponentRef = React.createRef();

    }

    componentDidMount = async () => {
        this.fetchAll();
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.match.params.exerciseId !== this.props.match.params.exerciseId) {
            this.fetchAll();
        }
    };

    fetchAll = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader;

        const exercise = await this.fetchExercise(exerciseId, authorizationHeader);
        const assignment = await this.fetchExerciseList(exercise, authorizationHeader);

        const submission = await this.fetchLastSubmission(exerciseId, authorizationHeader);
        const workspace = new Workspace(exercise, submission);

        this.setState({
            exercise,
            exercises: assignment.exercises,
            workspace,
        });
    };

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


    loadSubmissionById = async (submissionId) => {
        let submission;
        if (submissionId === -1) {
            submission = undefined;
        } else {
            const authorizationHeader = this.props.context.authorizationHeader;
            submission = await this.fetchSubmissionById(submissionId, authorizationHeader);
        }
        const exercise = this.state.exercise;
        const workspace = new Workspace(exercise, submission);

        this.setState({ workspace});
    };

    onCodeSubmit = () => {
        this.submit(false, this.resetRunButton);
        this.setState({ runButtonState: true });
    };

    resetRunButton = () => {
        this.setState({ runButtonState: false });
    };

    onIsDark = () => {
        this.setState({ isDark: !this.state.isDark });
    };

    onBottomTab = (key) => {
        this.setState({currBottomTab: key});
    }

    onShowToast = (show) => {
        this.setState({showToast: show});
    }

    createAlert = () => {
        return(
            <>
                <Alert variant="danger" show={this.state.showToast} onClose={this.onShowToast.bind(this, false)} dismissible>
                    <Alert.Heading>
                        <AlertCircle className="mr-2" size={25} />
                        <strong className="mr-auto">Outdated Submission!</strong>
                    </Alert.Heading>
                    <span>This task has been updated since your last submission. This can lead to issues. Your submision count has been reset. Please resubmit your solutions!</span>
                </Alert>
            </>
        );
    }

    submit = async (graded, callback) => {
        const toSubmit = this.exerciseComponentRef.current.getPublicFiles();

        let { workspace } = this.state;
        const authorizationHeader = this.props.context.authorizationHeader;

        let codeResponse = await SubmissionService.submit(workspace.exerciseId, toSubmit, graded, authorizationHeader)
            .catch(err => console.error(err));

        let maxTimeout = 20;    //max timeout in seconds
        if (workspace.exercise.type === 'code' && workspace.exercise.executionLimits) {
            // two times the timeout to account for communication overhead
            maxTimeout = workspace.exercise.executionLimits.timeout / 1000 * 2;
        }

        let timeoutCounter = 0;

        try {
            const intervalId = setInterval(async () => {
                if (timeoutCounter >= maxTimeout) {         //jump out of loop when we reached max timeout
                    clearInterval(intervalId);
                    return;
                }
                let evalResponse = await SubmissionService.checkEvaluation(codeResponse.evalId, authorizationHeader);   //checkEvaluation has a .catch statement already
                if ('ok' === evalResponse.status) {
                    const submissionId = evalResponse.submission;
                    clearInterval(intervalId);

                    const submission = await this.fetchSubmissionById(submissionId, authorizationHeader);
                    const workspace = new Workspace(this.state.workspace.exercise, submission);

                    this.setState({
                        workspace,
                    });
                    if (callback !== undefined) callback();
                }
                timeoutCounter += 1;
            }, 1000);
        } catch (e) {
            console.error('Failed to poll for evaluation status', e);
        }
    };

    renderMainExerciseArea(exercise, workspace) {
        let content = <p>unknown exercise type</p>;

        const key = exercise.id + '-' + workspace.submissionId;

        if (exercise.type === 'code') {
            content =
                <CodeExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                    authorizationHeader={this.props.context.authorizationHeader}
                    isDark={this.state.isDark}
                    onBottomTab={this.onBottomTab}
                    currBottomTab={this.state.currBottomTab}
                />;
        } else if (exercise.type === 'codeSnippet') {
            content =
                <CodeSnippetExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                    onBottomTab={this.onBottomTab}
                    currBottomTab={this.state.currBottomTab}
                />;
        } else if (exercise.type === 'text') {
            content =
                <TextExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                />;
        } else if (exercise.type === 'multipleChoice' || exercise.type === 'singleChoice') {
            content =
                <ChoiceExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                />;
        }
        return content;
    }

    render() {
        const { exercise, exercises, workspace } = this.state;

        if (!exercise) {
            return null;
        }

        const isCodeType = exercise.type === 'code' || exercise.type === 'codeSnippet';

        const selectedId = exercise.id;
        const submissionId = workspace.submissionId;

        const authorizationHeader = this.props.context.authorizationHeader;
        const content = this.renderMainExerciseArea(exercise, workspace);
        const versionList = <VersionList exercise={exercise} authorizationHeader={authorizationHeader}
                                         submit={this.submit} selectedSubmissionId={submissionId}
                                         changeSubmissionById={this.loadSubmissionById} isCodeType={isCodeType} isGraded={workspace.submission ? workspace.submission.graded : false }/>;


        let buttonCluster;
        if (isCodeType) {
            let runButtonContent;
            if (this.state.runButtonState) {
                runButtonContent = <Spinner text={'Processing'}/>;
            } else {
                runButtonContent = <>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="testrun-tooltip">
                            This button will <strong>run</strong>, <strong>test</strong> and <strong>save</strong> your code
                        </Tooltip>
                    }
                    >
                    <span><Play size={14}/>Test & Run</span>
                </OverlayTrigger>
                </>;
            }

            buttonCluster = (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="code-panel">
                            {/*<button className="style-btn" onClick={this.onIsDark}><FontAwesomeIcon icon="moon"/>
                            </button>*/}
                            <button className="style-btn" disabled={this.state.runButtonState}
                                    onClick={this.onCodeSubmit}>{runButtonContent}</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="row">
                    <div className="col-sm-2 d-none d-sm-block">
                        <div className={'panel'}>
                            <h4>Task list</h4>
                            <ExerciseList exercises={exercises} selectedId={selectedId} showScore={false}/>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={'panel'}>
                            {exercise.invalid && this.createAlert()}
                            {buttonCluster}
                            {content}
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className={'panel'}>
                            {versionList}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withAuth(Exercise);