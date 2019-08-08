import SubmissionService from '../../utils/SubmissionService';
import React, { Component } from 'react';

import './VersionList.css';
import equal from 'fast-deep-equal';
import Util from '../../utils/Util';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import PropTypes from 'prop-types';

class VersionList extends Component {

    state = {
        items: [],
        submissionState: false,
    };

    onSubmit = () => {
        this.props.submit(this.resetSubmitButton);
        this.setState({ submissionState: true });
    };

    resetSubmitButton = () => {
        this.setState({ submissionState: false });
    };

    componentDidMount = async () => {
        const { exercise } = this.props;
        const { authorizationHeader } = this.props;

        const items = await SubmissionService.getSubmissionList(exercise.id, authorizationHeader);
        this.setState({ items: items.submissions });
    };

    componentDidUpdate = async (prevProps) => {
        if (!equal(this.props.exercise, prevProps.exercise) || !equal(this.props.selectedSubmissionId, prevProps.selectedSubmissionId)) {
            const items = await SubmissionService.getSubmissionList(this.props.exercise.id, this.props.authorizationHeader);
            this.setState({
                items: items.submissions,
            });
        }
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

    render() {
        const items = this.state.items || [];
        const type = this.props.exercise.type;
        let RunButton;
        if(type === 'codeSnippet' || type === 'code') {
            RunButton = <button className="style-btn"  disabled={this.state.submissionState} onClick={this.onSubmit}>Run</button>
        }
        
        return (
            <div id={'version-wrapper'}>
                    <div>
                        <button className="style-btn submit"  disabled={this.state.submissionState} onClick={this.onSubmit}>Submit</button>
                        {RunButton}
                    </div>
                    <br/><br/>

                    <ul className="style-list">
                        {items.map(item =>
                            <li key={item.id} className={item.id === this.props.selectedSubmissionId ? 'active' : ''}>
                                <div id={item.id} className={'submission-item ' + (item.commitHash !== this.props.exercise.gitHash ? 'outdated' : '')}>
                                    <strong>Submission {item.version + 1}</strong>
                                    <br />
                                    <small>{Util.timeFormatter(item.timestamp)}</small>
                                    <br />
                                    <div className="two-box">
                                        <a href={null} className={"style-btn " + (item.commitHash !== this.props.exercise.gitHash ? 'warn' : 'submit')} onClick={this.props.changeSubmissionById.bind(this, item.id)}>⭯ Load</a>
                                        <OverlayTrigger trigger="focus"
                                                        placement="top"
                                                        overlay={this.createPopover(item.version, item.result, item.commitHash)}>
                                            <a href={null} className="style-btn">ⓘ Info</a>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </li>
                        )}
                        <br />
                        <li>
                            <div id={-1} className={'submission-item'}>
                                <strong>Template Version</strong>
                                <br />
                                <div className="one-box">
                                    <a href={null} className="style-btn submit" onClick={this.props.changeSubmissionById.bind(this, -1)}>⭯ Load</a>
                                </div>
                            </div>
                        </li>
                    </ul>
            </div>
        );
    }
}

VersionList.propTypes = {
    exercise: PropTypes.object.isRequired,
    authorizationHeader: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    selectedSubmissionId: PropTypes.string.isRequired,
    changeSubmissionById: PropTypes.func.isRequired,
};

export default VersionList;