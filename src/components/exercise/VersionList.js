import SubmissionService from '../../utils/SubmissionService';
import React, { Component } from 'react';

import './VersionList.css';
import equal from 'fast-deep-equal';
import Util from '../../utils/Util';
import { OverlayTrigger, Popover, Tabs, Tab } from 'react-bootstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowAltCircleLeft,
    faArrowLeft,
    faInfoCircle,
    faPaperPlane,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';


import PropTypes from 'prop-types';
import Spinner from '../core/Spinner';

library.add(faPaperPlane, faInfoCircle, faArrowLeft, faSpinner, faArrowAltCircleLeft);

class VersionList extends Component {

    state = {
        submissions: [],
        runs: [],
        submissionState: false,
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
        const {submissions, runs, submissionCount} = await SubmissionService.getSubmissionList(exerciseId, authorizationHeader);
        
        this.setState({ 
            submissions,
            runs,
            submissionCount: submissionCount
         });
    };

    createPopover(version, result, hints, outdated) {
        const score = result ? 'Score: ' + result.score + "/" + result.maxScore : 'No score';
        const hintlist = hints ? hints.map((hint, index) => <small key={index}>{'Hint:' + hint}</small>) : '';
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
                                        className={'style-btn ' + (outdated ? 'warn' : 'submit')}
                                        onClick={this.props.changeSubmissionById.bind(this, item.id)}><FontAwesomeIcon
                                        icon="arrow-alt-circle-left"></FontAwesomeIcon>Load
                                    </button>
                                    <span className="p-1"></span>
                                    <OverlayTrigger trigger="click"
                                                    rootClose={true}
                                                    placement="top"
                                                    overlay={this.createPopover((index + 1), item.result, item.hints, outdated)}>
                                        <button className="style-btn ghost"><FontAwesomeIcon icon="info-circle"/>Info</button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </li>
                    );

        return(ret_item);
    }
    

    render() {
        const submissions = this.state.submissions || [];
        const runs = this.state.runs || [];
        const isCodeType = this.props.isCodeType;

        let submitButtonContent;
        if (this.state.submissionState)
            submitButtonContent = <Spinner text={'Submitting'} />;
        else
            submitButtonContent = <><FontAwesomeIcon icon="paper-plane"/><span>Submit</span></>;

        const templatePart = (
            <li>
                <div id={-1} className={'submission-item'}>
                    <strong>{isCodeType ? 'Template Version' : 'Clear Fields'}</strong>
                    <br/>
                    <div className="two-box">
                        <button className="style-btn submit"
                                onClick={this.props.changeSubmissionById.bind(this, -1)}><FontAwesomeIcon
                            icon="arrow-alt-circle-left"/>{isCodeType ? 'Load' : 'Clear'}
                        </button>
                    </div>
                </div>
            </li>
        );

        return (
            <div id={'version-wrapper'}>
                
                <span className="style-btn ghost">
                    <h5>Score: {submissions.length && (submissions[0].result.score + " / " + submissions[0].result.maxScore)}</h5>
                </span>

                <br/><br />

                <button className="style-btn submit full"
                            disabled={this.state.submissionState || this.state.submissionCount.submissionsRemaining <= 0}
                            onClick={this.onSubmit}>{submitButtonContent}</button>
                <p><strong>{this.state.submissionCount.submissionsRemaining}</strong>{'/' + this.props.exercise.maxSubmits} Submissions available</p>
                
                <br/>

                {
                isCodeType ? 
                    <Tabs defaultActiveKey="sibmits" id="uncontrolled-tab-example">
                        <Tab eventKey="sibmits" title="Submits" >
                            <p>{submissions.length === 0 ? 'No submissions' : ''}</p>
                            <ul className="style-list">
                                {submissions.map((item, index) => this.createSubmissionItem(item, (submissions.length - index - 1), true),)}
                                {templatePart}
                            </ul>
                        </Tab>
                        <Tab eventKey="testrun" title="Testrun">
                            <p>{runs.length === 0 ? 'No Runs' : ''}</p>
                            <ul className="style-list">
                                {runs.map((item, index) => this.createSubmissionItem(item, (runs.length - index - 1), false),)}
                                {templatePart}
                            </ul>
                        </Tab>
                    </Tabs>
                :
                    <>
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