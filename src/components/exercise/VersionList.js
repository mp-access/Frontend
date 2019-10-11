import SubmissionService from '../../utils/SubmissionService';
import React, { Component } from 'react';

import equal from 'fast-deep-equal';
import Util from '../../utils/Util';
import { Alert, Modal, OverlayTrigger, Popover, Tab, Tabs } from 'react-bootstrap';
import { Flag, Info, RotateCcw, Send, X } from 'react-feather';
import PropTypes from 'prop-types';
import Spinner from '../core/Spinner';
import './VersionList.css';

class VersionList extends Component {

    state = {
        submissions: [],
        runs: [],
        submissionState: false,
        pastDueDate: false,
        submissionCount: {
            submissionsRemaining: 0,
        },
        showModal: false,
        currentTab: '',
    };

    onSubmit = () => {
        if (this.state.submissionCount.submissionsRemaining <= 1) {
            this.setShowModal(true);
        } else {
            this.confirmSubmit();
        }
    };

    confirmSubmit = () => {
        this.setShowModal(false);
        this.props.submit(true, this.resetSubmitButton);
        this.setState({ submissionState: true });
    };

    resetSubmitButton = () => {
        this.setState({ submissionState: false });
    };

    setCurrentTab = (key) => {
        this.setState({ currentTab: key });
    };

    componentDidMount = async () => {
        const { exercise } = this.props;

        this.fetchSubmissions(exercise.id);
        this.setCurrentTab(this.props.isGraded ? 'submits' : 'testruns');
    };

    componentDidUpdate = async (prevProps) => {
        const { exercise, selectedSubmissionId } = this.props;
        if (!equal(exercise, prevProps.exercise) || !equal(selectedSubmissionId, prevProps.selectedSubmissionId)) {
            this.fetchSubmissions(exercise.id);
            this.setCurrentTab(this.props.isGraded ? 'submits' : 'testruns');
        }
    };

    fetchSubmissions = async (exerciseId) => {
        const { authorizationHeader } = this.props;
        const { submissions, runs, submissionCount, pastDueDate } = await SubmissionService.getSubmissionList(exerciseId, authorizationHeader);

        this.setState({
            submissions,
            runs,
            pastDueDate,
            submissionCount: submissionCount,
        });
    };

    createPopover(version, result, hints, outdated, triggeredReSubmission) {
        const hintlist = hints ? (hints.map((hint, index) =>
            <Alert key={index} variant="warning">
                <Flag size={14}/> Hint<br/>
                {hint}
            </Alert>))[0] : '';
        const alert = outdated ? <Alert variant="danger">This submission is outdated!</Alert> : '';
        const triggered = triggeredReSubmission ?
            <Alert variant="primary">This is an automatically triggered submission by the system</Alert> : '';
        let score = 'No Score';
        if (result) {
            score = <>
                Your Score: {result.score}
                <br/>
                Max Points: {result.maxScore}
            </>;
        }

        return (
            <Popover id="popover-basic">
                <Popover.Title>{triggeredReSubmission ? 'Automatic Submission' : 'Submission ' + version}</Popover.Title>
                <Popover.Content>
                    {alert}
                    {triggered}
                    <pre>{score}</pre>
                    {hintlist}
                </Popover.Content>
            </Popover>
        );
    }

    createSubmissionItem(item, index, isSubmit) {
        const active = item.id === this.props.selectedSubmissionId;
        const outdated = item.invalid;
        const triggeredReSubmission = item.triggeredReSubmission;
        const title = (triggeredReSubmission ? 'Automatic Submission' : (isSubmit ? 'Submission ' : 'Testrun ') + (index + 1));

        const ret_item = (
            <li key={item.id} className={active ? 'active' : ''}>
                <div id={item.id}
                     className={'submission-item ' + (outdated ? 'outdated' : '')}>
                    <strong>{title}{item.result && <span className="float-right">({item.result.score}P)</span>}</strong>
                    <br/>
                    <small>{Util.dateTimeFormatter(item.timestamp, !Util.isClientAndServerTZEquals())}</small>
                    <br/>
                    <div className="two-box">
                        <button
                            className={'style-btn ' + (outdated ? 'warn' : '')}
                            onClick={this.props.changeSubmissionById.bind(this, item.id)}>
                            <RotateCcw size={14}/>Load
                        </button>
                        <span className="p-1"></span>
                        {isSubmit &&
                        <OverlayTrigger trigger="click"
                                        rootClose={true}
                                        placement="top"
                                        overlay={this.createPopover((index + 1), item.result, item.result ? item.result.hints : [], outdated, triggeredReSubmission)}>
                            <button className="style-btn ghost"><Info size={14}/>Info</button>
                        </OverlayTrigger>
                        }
                    </div>
                </div>
            </li>
        );

        return (ret_item);
    }

    setShowModal = (show) => {
        this.setState({ showModal: show });
    };

    lastSubmissionWarning() {
        const { showModal } = this.state;

        return (
            <>
                <Modal centered show={showModal} onHide={this.setShowModal.bind(this, false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Last Submission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>This is you last submission for this task. Are you sure you want to submit?</Modal.Body>
                    <Modal.Footer>
                        <button className="style-btn" onClick={this.setShowModal.bind(this, false)}>
                            <X size={14}/> Close
                        </button>
                        <button className="style-btn submit" onClick={this.confirmSubmit}>
                            <Send size={14}/> Submit
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }


    render() {
        const submissions = this.state.submissions || [];
        const runs = this.state.runs || [];
        const { isCodeType, exercise } = this.props;
        const score = submissions.length && submissions[0] && submissions[0].result && submissions[0].result.score ? submissions[0].result.score : 0;
        const maxScore = exercise.maxScore ? exercise.maxScore : 1;
        const scorePercent = (score / maxScore * 100);

        let scoreProgress = 'low';

        if (scorePercent > 75) {
            scoreProgress = 'full';
        } else if (scorePercent >= 50) {
            scoreProgress = 'mid';
        }


        let submitButtonContent;
        if (this.state.submissionState)
            submitButtonContent = <Spinner text={'Submitting'}/>;
        else
            submitButtonContent = <><Send size={14}/>Submit</>;

        const templatePart = (
            <li>
                <div id={-1} className={'submission-item'}>
                    <strong>{isCodeType ? 'Template Version' : 'Clear Fields'}</strong>
                    <br/>
                    <div className="two-box">
                        <button className="style-btn"
                                onClick={this.props.changeSubmissionById.bind(this, -1)}>
                            <RotateCcw size={14}/>Reset
                        </button>
                    </div>
                </div>
            </li>
        );

        return (
            <div id={'version-wrapper'}>
                {this.lastSubmissionWarning()}

                <span className="score-board">
                    <span>Score: <strong>{score}</strong> / {maxScore}</span>
                    <span className={'score-bar ' + scoreProgress} style={{
                        width: scorePercent + '%',
                    }}>
                    </span>
                </span>

                {!this.state.pastDueDate &&
                <>
                    <button className="style-btn submit full"
                            disabled={this.state.submissionState || this.state.submissionCount.submissionsRemaining <= 0}
                            onClick={this.onSubmit}>{submitButtonContent}</button>
                    <div className="text-center mt-1">
                        <small>
                            <strong>{this.state.submissionCount.submissionsRemaining}</strong> Submissions available
                        </small>
                    </div>
                    <br/>
                </>
                }

                {isCodeType ?
                    <Tabs activeKey={this.state.currentTab} id="submit-test-tab" onSelect={this.setCurrentTab}>
                        <Tab eventKey="testruns" title="Testruns">
                            {runs.length === 0 ? <div className="py-3">No runs</div> : ''}
                            <ul className="style-list">
                                {runs.slice(0, 6).map((item, index) => this.createSubmissionItem(item, (runs.length - index - 1), false))}
                                {templatePart}
                            </ul>
                        </Tab>
                        <Tab eventKey="submits" title="Submits">
                            {submissions.length === 0 ? <div className="py-3">No submissions</div> : ''}
                            <ul className="style-list">
                                {submissions.map((item, index) => this.createSubmissionItem(item, (submissions.length - index - 1), true))}
                                {templatePart}
                            </ul>
                        </Tab>
                    </Tabs>
                    :
                    <>
                        <h4>Submissions</h4>
                        <p>{submissions.length === 0 ? 'No submissions' : ''}</p>
                        <ul className="style-list">
                            {submissions.map((item, index) => this.createSubmissionItem(item, (submissions.length - index - 1), true))}
                            {templatePart}
                        </ul>
                    </>
                }


            </div>
        );
    }
}

VersionList.propTypes = {
    exercise: PropTypes.object.isRequired,
    authorizationHeader: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    selectedSubmissionId: PropTypes.string.isRequired,
    changeSubmissionById: PropTypes.func.isRequired,
};

export default VersionList;