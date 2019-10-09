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
import { AlertCircle, ExternalLink, X } from 'react-feather';
import { Alert, Modal } from 'react-bootstrap';
import { withBreadCrumbsAndAuthAndRouter } from '../components/BreadCrumbProvider';

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
            exercises: [],
            workspace: Workspace,
            runButtonState: false,
            currBottomTab: 'tests',
            showAlert: true,
            isDirty: false,
            showModal: false,
            targetLocation: ''
        };
        this.exerciseComponentRef = React.createRef();
    }

    componentDidMount = async () => {
        this.fetchAll();

        this.unblock = this.props.history.block(targetLocation => {
            if(this.state.isDirty){
                this.setState({showModal: true, targetLocation});
                return false;
            }
        });
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.match.params.exerciseId !== this.props.match.params.exerciseId) {
            this.fetchAll();

            this.unblock = this.props.history.block(targetLocation => {
                if(this.state.isDirty){
                    this.setState({showModal: true, targetLocation});
                    return false;
                }
            });
        }
    };

    componentWillUnmount() {
        this.props.crumbs.setBreadCrumbs([]);
    }

    leaveExercise = () => {
        this.unblock();

        this.setState({
            isDirty: false,
            showModal: false,
            targetLocation: ''
        });

        this.props.history.push(this.state.targetLocation.pathname);
    }


    fetchAll = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader;

        const exercise = await this.fetchExercise(exerciseId, authorizationHeader);
        const assignment = await this.fetchExerciseList(exercise, authorizationHeader);

        const submission = await this.fetchLastSubmission(exerciseId, authorizationHeader);
        const workspace = new Workspace(exercise, submission);


        this.props.crumbs.setBreadCrumbs(exercise.breadCrumbs);

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

    onBottomTab = (key) => {
        this.setState({currBottomTab: key});
    }

    setShowAlert = (show) => {
        this.setState({showAlert: show});
    }

    onShowLeaveModal = (show) => {
        this.setState({showModal: show});
    }

    setIsDirty = (dirty) =>{
        if(this.state.isDirty !== dirty){
            this.setState({isDirty: dirty});
        }
    }

    createAlert = () => {
        return(
            <>
                <Alert variant="danger" show={this.state.showAlert} onClose={this.setShowAlert.bind(this, false)} dismissible>
                    <Alert.Heading>
                        <AlertCircle className="mr-2" size={25} />
                        <strong className="mr-auto">Outdated Submission!</strong>
                    </Alert.Heading>
                    <span>
                        This task has been updated since your last submission. This might affect your grade, so we allow further submissions. Please reset your code to the template to make sure that you have all up-to-date information. 
                        <br />
                        Please note that if you do not provide a new submission yourself, we will automatically re-submit your last (now outdated) submission after the deadline. 
                        <br />
                        You will find more information in the <a target="_blank" href="https://github.com/mp-access/Backend/wiki/Outdated-Submission">documentation</a>.
                    </span>
                </Alert>
            </>
        );
    };

    createLeaveOnDirtyModal() {
        const { showModal} = this.state;

        return (
          <>
            <Modal centered show={showModal} onHide={this.onShowLeaveModal.bind(this, false)}>
              <Modal.Header closeButton>
                <Modal.Title>Unsaved Changes</Modal.Title>
              </Modal.Header>
              <Modal.Body>You have unsaved changes in your exercise! Do you want to leave without saving?</Modal.Body>
              <Modal.Footer>
                <button className="style-btn" onClick={this.onShowLeaveModal.bind(this, false)}>
                  <X size={14} /> Close
                </button>
                <button className="style-btn submit" onClick={this.leaveExercise}>
                  <ExternalLink size={14} /> Leave
                </button>
              </Modal.Footer>
            </Modal>
          </>
        );
    };

    submit = async (graded, callback) => {
        const toSubmit = this.exerciseComponentRef.current.getPublicFiles();

        let { workspace } = this.state;
        const authorizationHeader = this.props.context.authorizationHeader;

        let codeResponse;
        try{
            codeResponse = await SubmissionService.submit(workspace.exerciseId, toSubmit, graded, authorizationHeader);
        }catch(err) {
            console.error(err);
            if (callback !== undefined) callback();
            return;
        };



        let maxTimeout = 20;    //max timeout in seconds
        if ((workspace.exercise.type === 'code' || workspace.exercise.type === 'codeSnippet') && workspace.exercise.executionLimits) {
            // two times the timeout to account for communication overhead
            maxTimeout = workspace.exercise.executionLimits.timeout / 1000 * 2;
        }

        let timeoutCounter = 0;

        try {
            const intervalId = setInterval(async () => {
                if (timeoutCounter >= maxTimeout) {         //jump out of loop when we reached max timeout
                    clearInterval(intervalId);
                    if (callback !== undefined) callback();
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
                        isDirty: false
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
                    onBottomTab={this.onBottomTab}
                    currBottomTab={this.state.currBottomTab}
                    setIsDirty={this.setIsDirty}
                    submit={this.submit}
                />;
        } else if (exercise.type === 'codeSnippet') {
            content =
                <CodeSnippetExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                    authorizationHeader={this.props.context.authorizationHeader}
                    onBottomTab={this.onBottomTab}
                    currBottomTab={this.state.currBottomTab}
                    setIsDirty={this.setIsDirty}
                    submit={this.submit}
                />;
        } else if (exercise.type === 'text') {
            content =
                <TextExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    setIsDirty={this.setIsDirty}
                    authorizationHeader={this.props.context.authorizationHeader}
                    workspace={workspace}
                />;
        } else if (exercise.type === 'multipleChoice' || exercise.type === 'singleChoice') {
            content =
                <ChoiceExercise
                    key={key}
                    ref={this.exerciseComponentRef}
                    exercise={exercise}
                    workspace={workspace}
                    authorizationHeader={this.props.context.authorizationHeader}
                    setIsDirty={this.setIsDirty}
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

        return (
            <>
                {this.state.isDirty && this.createLeaveOnDirtyModal()}

                <div className="exercise-layout">
                    <div className="ex-left">
                        <div className={'panel'}>
                            <h4>Task list</h4>
                            <ExerciseList exercises={exercises} selectedId={selectedId} showScore={false}/>
                        </div>
                    </div>
                    <div className="ex-mid">
                        <div className={'panel'}>
                            {(workspace.submission && workspace.submission.invalid) && this.createAlert()}
                            <h1 className="float-left">{this.state.exercise.longTitle}</h1>
                            {content}
                        </div>
                    </div>
                    <div className="ex-right">
                        <div className={'panel'}>
                            {versionList}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withBreadCrumbsAndAuthAndRouter(Exercise);
