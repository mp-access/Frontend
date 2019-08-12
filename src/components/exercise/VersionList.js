import SubmissionService from '../../utils/SubmissionService';
import React, { Component } from 'react';

import './VersionList.css';
import equal from 'fast-deep-equal';
import Util from '../../utils/Util';
import { OverlayTrigger, Popover } from 'react-bootstrap';


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

library.add(faPaperPlane, faInfoCircle, faArrowLeft, faSpinner, faArrowAltCircleLeft);

class VersionList extends Component {

    state = {
        items: [],
        submissionState: false,
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
        const items = await SubmissionService.getSubmissionList(exerciseId, authorizationHeader);
        this.setState({ items: items.submissions });
    };

    createPopover(version, result, commitHash) {
        const score = result ? result.score : 'no score';
        const alert = commitHash !== this.props.exercise.gitHash && <span><br/>(This Submission is outdated)</span>;

        return (
            <Popover id="popover-basic" title={'Version ' + (version + 1)}>
                {score}
                {alert}
            </Popover>
        );
    }

    availableSubmits() {
        // TODO: Only count if is not outdated and not run submission
        return Math.max(this.props.exercise.maxSubmits - this.state.items.length, 0);
    }

    render() {
        const items = this.state.items || [];
        const isCodeType = this.props.isCodeType;

        let submitButtonContent;
        if (this.state.submissionState)
            submitButtonContent = <><FontAwesomeIcon icon="spinner" spin/><span>Processing...</span></>;
        else
            submitButtonContent = <><FontAwesomeIcon icon="paper-plane"/><span>Submit</span></>;

        let templatePart;
        if (isCodeType) {
            templatePart = (
                <li>
                    <div id={-1} className={'submission-item'}>
                        <strong>Template Version</strong>
                        <br/>
                        <div className="two-box">
                            <button className="style-btn submit"
                                    onClick={this.props.changeSubmissionById.bind(this, -1)}><FontAwesomeIcon
                                icon="arrow-alt-circle-left"/>Load
                            </button>
                        </div>
                    </div>
                </li>
            );
        }

        return (
            <div id={'version-wrapper'}>


                <div>
                    <p><strong>{this.availableSubmits()}</strong>{'/' + this.props.exercise.maxSubmits} Submissions
                        available</p>
                    <button className="style-btn submit full"
                            disabled={this.state.submissionState || this.availableSubmits() <= 0}
                            onClick={this.onSubmit}>{submitButtonContent}</button>
                </div>
                <br/>

                <h4>{isCodeType ? 'Versions' : 'Submission'}</h4>

                {items.length === 0 ? 'No submissions' : ''}

                <ul className="style-list">

                    {items.map(item =>
                        <li key={item.id} className={item.id === this.props.selectedSubmissionId ? 'active' : ''}>
                            <div id={item.id}
                                 className={'submission-item ' + (item.commitHash !== this.props.exercise.gitHash ? 'outdated' : '')}>
                                <strong>Submission {item.version + 1}</strong>
                                <br/>
                                <small>{Util.timeFormatter(item.timestamp)}</small>
                                <br/>
                                <div className="two-box">
                                    <button
                                        className={'style-btn ' + (item.commitHash !== this.props.exercise.gitHash ? 'warn' : 'submit')}
                                        onClick={this.props.changeSubmissionById.bind(this, item.id)}><FontAwesomeIcon
                                        icon="arrow-alt-circle-left"></FontAwesomeIcon>Load
                                    </button>
                                    <span className="p-1"></span>
                                    <OverlayTrigger trigger="focus"
                                                    placement="top"
                                                    overlay={this.createPopover(item.version, item.result, item.commitHash)}>
                                        <button className="style-btn ghost"><FontAwesomeIcon icon="info-circle"/>Info
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </li>,
                    )}
                    {templatePart}
                </ul>
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