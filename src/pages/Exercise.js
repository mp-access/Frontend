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
import { Alert, Col, Container, Form, Modal, Row, Stack } from 'react-bootstrap';
import { withBreadCrumbsAndAuthAndRouter } from '../components/BreadCrumbProvider';
import ResultService from '../utils/ResultService';
import AssistantExport from '../utils/AdminService';
import Spinner from '../components/core/Spinner';
import AdminService from '../utils/AdminService';
import { ToastContainer, toast } from 'react-toastify';

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
            exercises: [],
            results: [],
            workspace: Workspace,
            runButtonState: false,
            currBottomTab: 'tests',
            showAlert: true,
            isDirty: false,
            showModal: false,
            targetLocation: '',
            userId: '',
            isLoadingExercise: true,
            pastDueDate: false,
            isPrivileged: false,
        };
        this.exerciseComponentRef = React.createRef();
    }

    componentDidMount = async () => {
        this.fetchAll();

        this.unblock = this.props.history.block(targetLocation => {
            if (this.state.isDirty) {
                this.setState({ showModal: true, targetLocation });
                return false;
            }
        });
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.match.params.exerciseId !== this.props.match.params.exerciseId) {
            this.fetchUpdate();

            this.unblock = this.props.history.block(targetLocation => {
                if (this.state.isDirty) {
                    this.setState({ showModal: true, targetLocation });
                    return false;
                }
            });

            sessionStorage.setItem('selectedFile', null);
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
            targetLocation: '',
        });

        this.props.history.push(this.state.targetLocation.pathname);
    };


    fetchUpdate = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader;
        const isPrivileged = this.props.context.isCourseAssistant();

        this.fetchExercise(exerciseId, authorizationHeader, isPrivileged).then(async updatedExercise => {
            if (!updatedExercise) return;
            const submission = await this.fetchLastSubmission(updatedExercise.id, this.state.userId, authorizationHeader);
            const workspace = new Workspace(updatedExercise, submission);

            this.props.crumbs.setBreadCrumbs(updatedExercise.breadCrumbs);

            this.setState({
                exercise: updatedExercise,
                workspace,
            });
        });
    };

    fetchAll = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader;
        const isPrivileged = this.props.context.isCourseAssistant();
        const userId = this.props.context.userId();

        this.fetchExercise(exerciseId, authorizationHeader, isPrivileged).then(async exercise => {
            if (!exercise) {
                this.setState({ isLoadingExercise: false });
                return;
            }

            const assignment = await this.fetchExerciseList(exercise, authorizationHeader);
            const results = await this.fetchAssignmentResults(exercise, authorizationHeader);

            const submission = await this.fetchLastSubmission(exerciseId, userId, authorizationHeader);
            const workspace = new Workspace(exercise, submission);

            let participants = [];
            if (isPrivileged) {
                participants = await AssistantExport.fetchCourseParticipants(exercise.courseId, authorizationHeader);
                participants = participants.usersFound;
            }
            participants.sort((p1, p2) => p1.emailAddress.localeCompare(p2.emailAddress));

            this.props.crumbs.setBreadCrumbs(exercise.breadCrumbs);

            this.setState({
                exercise,
                exercises: assignment.exercises,
                results,
                workspace,
                participants: participants,
                userId: userId,
                isLoadingExercise: false,
                pastDueDate: assignment.pastDueDate,
                isPrivileged: isPrivileged,
            });
        });
    };

    fetchExercise = (exerciseId, authHeader, isPrivileged) => {
        return CourseDataService.getExercise(exerciseId, authHeader, isPrivileged)
            .catch(err => console.error(err));
    };

    fetchExerciseList = (exercise, authHeader) => {
        return CourseDataService.getAssignment(exercise.courseId, exercise.assignmentId, authHeader)
            .catch(err => console.error(err));
    };

    fetchAssignmentResults = (exercise, authHeader) => {
        return ResultService.getCourseResults(exercise.courseId, authHeader)
            .then(result => {
                return result.find(r => r.assignmentId === exercise.assignmentId);
            })
            .catch(err => console.error(err));
    };

    fetchLastSubmission = (exerciseId, userId, authHeader) => {
        return SubmissionService.getLastSubmission(exerciseId, userId, authHeader)
            .catch(err => console.error(err));
    };

    fetchSubmissionById = (exerciseId, submissionId, authHeader) => {
        return SubmissionService.getSubmission(exerciseId, submissionId, authHeader)
            .catch(err => console.error(err));
    };


    loadSubmissionById = async (submissionId) => {
        let submission;
        if (submissionId === -1) {
            submission = undefined;
        } else {
            const exerciseId = this.state.exerciseId;
            const authorizationHeader = this.props.context.authorizationHeader;
            submission = await this.fetchSubmissionById(exerciseId, submissionId, authorizationHeader);
        }
        const exercise = this.state.exercise;
        const workspace = new Workspace(exercise, submission);

        this.setState({ workspace });
    };

    onBottomTab = (key) => {
        this.setState({ currBottomTab: key });
    };

    setShowAlert = (show) => {
        this.setState({ showAlert: show });
    };

    onShowLeaveModal = (show) => {
        this.setState({ showModal: show });
    };

    setIsDirty = (dirty) => {
        if (this.state.isDirty !== dirty) {
            this.setState({ isDirty: dirty });
        }
    };

    createAlert = () => {
        return (
            <>
                <Alert variant="danger" show={this.state.showAlert} onClose={this.setShowAlert.bind(this, false)}
                       dismissible>
                    <Alert.Heading>
                        <AlertCircle className="mr-2" size={25}/>
                        <strong className="mr-auto">Outdated Submission!</strong>
                    </Alert.Heading>
                    <span>
                        This task has been updated since your last submission. This might affect your grade, so we allow further submissions. Please reset your code to the template to make sure that you have all up-to-date information. 
                        <br/>
                        Please note that if you do not provide a new submission yourself, we will automatically re-submit your last (now outdated) submission after the deadline. 
                        <br/>
                        You will find more information in the <a target="_blank" rel="noopener noreferrer"
                                                                 href="https://github.com/mp-access/Backend/wiki/Outdated-Submission">documentation</a>.
                    </span>
                </Alert>
            </>
        );
    };

    createLeaveOnDirtyModal() {
        const { showModal } = this.state;

        return (
            <>
                <Modal centered show={showModal} onHide={this.onShowLeaveModal.bind(this, false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Unsaved Changes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You have unsaved changes in your exercise! Do you want to leave without
                        saving?</Modal.Body>
                    <Modal.Footer>
                        <button className="style-btn" onClick={this.onShowLeaveModal.bind(this, false)}>
                            <X size={14}/>Stay
                        </button>
                        <button className="style-btn submit" onClick={this.leaveExercise}>
                            <ExternalLink size={14}/>Leave
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    };

    submit = async (graded, callback) => {
        const toSubmit = this.exerciseComponentRef.current.getPublicFiles();
        const { workspace } = this.state;
        const authorizationHeader = this.props.context.authorizationHeader;
        const userId = this.props.context.userId();

        let evalId;
        try {
            evalId = await SubmissionService.submit(workspace.exercise.courseId, workspace.exerciseId, userId, toSubmit, graded, authorizationHeader);
        } catch (err) {
            console.error(err);
            if (callback !== undefined) callback({ type: 'err', info: err });
            return;
        }


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
                    if (callback !== undefined) callback({ type: 'err', info: 'Max Timeout reached' });
                    return;
                }
                //checkEvaluation has a .catch statement already
                let evalResponse = await SubmissionService.checkEvaluation(workspace.exerciseId, evalId, authorizationHeader);
                if ('ok' === evalResponse.status) {
                    const submissionId = evalResponse.submission;
                    clearInterval(intervalId);

                    const submission = await this.fetchSubmissionById(workspace.exerciseId, submissionId, authorizationHeader);
                    const results = await this.fetchAssignmentResults(workspace.exercise, authorizationHeader);
                    const newWorkspace = new Workspace(workspace.exercise, submission);

                    this.setState({
                        workspace: newWorkspace,
                        results,
                        isDirty: false,
                        userId: userId, // go back to own user view
                    });
                    if (callback !== undefined) callback({ type: 'ok' });
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
        const { context } = this.props;

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
                    authContext={context}
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
                    authContext={context}
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
                    authContext={context}
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
                    authContext={context}
                />;
        }
        return content;
    }

    onUserChange = async (e) => {
        // Load as user
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader;
        const userId = e.target.value || this.props.context.userId();
        const submission = await SubmissionService.getLastSubmission(exerciseId, userId, authorizationHeader);

        const workspace = new Workspace(this.state.exercise, submission);
        this.setState({ workspace, userId: userId });
    }

    resetSubmissionCount = async () => {
        // Load as user
        const { exercise } = this.state
        const authorizationHeader = this.props.context.authorizationHeader
        const userId = this.state.userId
        const status = await AdminService.resetSubmissionsCount(exercise.courseId, exercise.id, userId, authorizationHeader)
        console.log(status);
        const toastOptions = { position: 'top-center' }
        if (status)
            toast.success('Successfully reset submission count', toastOptions)
        else
            toast.error(`Failed to reset submission count, try again later`, toastOptions)
    }

    render() {
        const { exercise, exercises, workspace, results, userId, isLoadingExercise, pastDueDate, isPrivileged } = this.state;

        if (!exercise) {
            if (!isLoadingExercise && !exercise) {
                throw new Error('404');
            }

            return <div className="loading-box"><Spinner text={'Loading Tasks...'}/></div>;
        }

        const isCodeType = exercise.type === 'code' || exercise.type === 'codeSnippet';

        const selectedId = exercise.id;
        const submissionId = workspace.submissionId;
        const gradedSubmissions = results.gradedSubmissions ? results.gradedSubmissions : [];

        const authorizationHeader = this.props.context.authorizationHeader;
        const content = this.renderMainExerciseArea(exercise, workspace);
        const versionList = <VersionList exercise={exercise} authorizationHeader={authorizationHeader}
                                         submit={this.submit} selectedSubmissionId={submissionId}
                                         changeSubmissionById={this.loadSubmissionById} isCodeType={isCodeType}
                                         isGraded={workspace.submission ? workspace.submission.graded : false}
                                         userId={userId} isPrivileged={isPrivileged} />;

        return (
            <>
                {this.state.isDirty && this.createLeaveOnDirtyModal()}
                {workspace.submission && workspace.submission.invalid && this.createAlert()}

                <div className="exercise-layout">
                    <div className="ex-left">
                        <div className={'panel'}>
                            <h4>Task list</h4>
                            <ExerciseList exercises={exercises}
                                          selectedId={selectedId}
                                          gradedSubmissions={gradedSubmissions}
                                          showScore={false}
                                          pastDueDate={pastDueDate}/>
                        </div>
                    </div>
                    <Stack gap='3' className="ex-mid">
                        {isPrivileged &&
                            <Container className='panel-background'>
                                <Form as={Row} className='justify-content-center'>
                                    <Col xs='auto'><h3>Control Panel</h3></Col>
                                    <Col xs='auto'>
                                        <Form.Select onChange={this.onUserChange} value={this.state.userId}>
                                            <option value=''>Select Student to Impersonate...</option>
                                            {this.state.participants.map(student =>
                                                <option key={student.id} value={student.id}>{student.emailAddress}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col xs='auto'>
                                        <button className='style-btn' onClick={this.onUserChange}>
                                            Back to myself
                                        </button>
                                    </Col>
                                    <Col xs='auto'>
                                        <button className='style-btn warn' onClick={this.resetSubmissionCount}>
                                            Reset Submission Count
                                        </button>
                                    </Col>
                                    <ToastContainer />
                                </Form>
                            </Container>
                        }
                        <div className='panel'>
                            {!isCodeType && <h1>{this.state.exercise.longTitle}</h1>}
                            {content}
                        </div>
                    </Stack>
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
