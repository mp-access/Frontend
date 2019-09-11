import SubmissionService from '../../utils/SubmissionService';
import React, { Component } from 'react';

import equal from 'fast-deep-equal';
import Util from '../../utils/Util';
import { OverlayTrigger, Popover, Tabs, Tab } from 'react-bootstrap';
import { Send, RotateCcw } from 'react-feather';
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
            submissionsRemaining: 0
        }
    };

    onSubmit = () => {
        this.props.submit(true, this.resetSubmitButton);
        this.setState({ submissionState: true });
    };

    resetSubmitButton = () => {
        this.setState({ submissionState: false });
    };

    componentDidMount = async () => {
        const { exercise } = this.props;

        this.fetchSubmissions(exercise.id);
    };

    componentDidUpdate = async (prevProps) => {
        const { exercise, selectedSubmissionId } = this.props;
        if (!equal(exercise, prevProps.exercise) || !equal(selectedSubmissionId, prevProps.selectedSubmissionId)) {
            this.fetchSubmissions(exercise.id);
        }
    };

    fetchSubmissions = async (exerciseId) => {
        const { authorizationHeader } = this.props;
        const {submissions, runs, submissionCount, pastDueDate} = await SubmissionService.getSubmissionList(exerciseId, authorizationHeader);
        
        this.setState({ 
            submissions,
            runs,
            pastDueDate,
            submissionCount: submissionCount
         });
    };

    createPopover(version, result, hints, outdated) {
        const score = result ? 'Score: ' + result.score + "/" + result.maxScore : 'No score';
        const hintlist = hints ? hints.map((hint, index) => <small key={index}><br/>{'Hint ' + (index+1) + ": " + hint}</small>) : '';
        const alert = outdated ? <small><br/>[This Submission is outdated]</small> : '';

        return (
            <Popover id="popover-basic">
                <Popover.Title>{'Submission ' + version}</Popover.Title>
                <Popover.Content>
                    {score}
                    {hintlist}
                    {alert}
                </Popover.Content>
            </Popover>
        );
    }

    createSubmissionItem(item, index, isSubmit){
        const active = item.id === this.props.selectedSubmissionId;
        const outdated = item.invalid;
        const title = (isSubmit ? 'Submission ' : 'Run ') + (index + 1); 


        const ret_item = (
            <li key={item.id} className={ active ? 'active' : ''}>
                <div id={item.id}
                        className={'submission-item ' + (outdated ? 'outdated' : '')}>
                    <strong>{title}{item.result && <span className="float-right">({item.result.score}P)</span>}</strong>
                    <br/>
                    <small>{Util.timeFormatter(item.timestamp)}</small>
                    <br/>
                    <div className="two-box">
                        <button
                            className={'style-btn ' + (outdated ? 'warn' : '')}
                            onClick={this.props.changeSubmissionById.bind(this, item.id)}>
                                <RotateCcw size={14} />Load
                        </button>
                        <span className="p-1"></span>
                        {isSubmit && 
                        <OverlayTrigger trigger="click"
                                        rootClose={true}
                                        placement="top"
                                        overlay={this.createPopover((index + 1), item.result, item.result ? item.result.hints : [], outdated)}>
                            <button className="style-btn ghost">Info</button>
                        </OverlayTrigger>
                        }
                    </div>
                </div>
            </li>
        );

        return(ret_item);
    }
    

    render() {
        const submissions = this.state.submissions || [];
        const runs = this.state.runs || [];
        const {isCodeType} = this.props;

        let submitButtonContent;
        if (this.state.submissionState)
            submitButtonContent = <Spinner text={'Submitting'} />;
        else
            submitButtonContent = <><Send size={14} />Submit</>;

        const templatePart = (
            <li>
                <div id={-1} className={'submission-item'}>
                    <strong>{isCodeType ? 'Template Version' : 'Clear Fields'}</strong>
                    <br/>
                    <div className="two-box">
                        <button className="style-btn"
                                onClick={this.props.changeSubmissionById.bind(this, -1)}>
                                    <RotateCcw size={14} />Reset
                        </button>
                    </div>
                </div>
            </li>
        );

        return (
            <div id={'version-wrapper'}>
                
                {(submissions[0] && submissions[0].result) &&
                <span className="score-board">
                    Score: {submissions.length && <><strong>{submissions[0].result.score}</strong> / {submissions[0].result.maxScore}</>}
                </span>
                }

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
                    <Tabs defaultActiveKey="sibmits" id="uncontrolled-tab-example">
                        <Tab eventKey="testruns" title="Testruns">
                            {runs.length === 0 ? <div className="py-3">No Runs</div> : ''}
                            <ul className="style-list">
                                {runs.map((item, index) => this.createSubmissionItem(item, (runs.length - index - 1), false),)}
                                {templatePart}
                            </ul>
                        </Tab>
                        <Tab eventKey="sibmits" title="Submits" >
                            {submissions.length === 0 ? <div className="py-3">No submissions</div> : ''}
                            <ul className="style-list">
                                {submissions.map((item, index) => this.createSubmissionItem(item, (submissions.length - index - 1), true),)}
                                {templatePart}
                            </ul>
                        </Tab>
                    </Tabs>
                :
                    <>
                        <h4>Submissions</h4>
                        <p>{submissions.length === 0 ? 'No submissions' : ''}</p>
                        <ul className="style-list">
                            {submissions.map((item, index) => this.createSubmissionItem(item, (submissions.length - index - 1), true),)}
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