import SubmissionService from "../../utils/SubmissionService";
import React, {Component} from 'react';

import "./VersionList.css"
import equal from 'fast-deep-equal'
import Util from '../../utils/Util';
import {OverlayTrigger, Popover} from 'react-bootstrap'

class VersionList extends Component {

    state = { items:[] }

    componentDidMount = async () => {
        const {exercise} = this.props;
        const {authorizationHeader} = this.props;

        const items = await SubmissionService.getSubmissionList(exercise.id, authorizationHeader);
        this.setState({items: items.submissions});
    }

    componentDidUpdate = async (prevProps) => {
        if(!equal(this.props.exercise, prevProps.exercise)){
            const items = await SubmissionService.getSubmissionList(this.props.exercise.id, this.props.authorizationHeader);
            this.setState({
                items: items.submissions
            });
        }
    }

    createPopover(version, result, commitHash){
        const score = result ? result.score : "no score";
        const alert = commitHash !== this.props.exercise.gitHash && <span><br/>(This Submission is outdated)</span>
            
        return(
            <Popover id="popover-basic" title={"Version " + (version+1)}>
                {score}
                {alert}
            </Popover>
        );
    }

    render() {
        const items = this.state.items || [];

        return (
            <div id={"version-wrapper"}>
                <ul>
                    <li><button onClick={this.props.changeSubmissionById.bind(this, -1)}>⭯</button> Revert Template</li>
                    <li><hr/></li>
                    { <li><button onClick={this.props.submit.bind(this)}>Submit</button></li> }
                    {items.map(item => <li key={item.id}>                        
                        <div id={item.id} className={'submission-item ' + (item.commitHash !== this.props.exercise.gitHash ? 'outdated' : '') + ' ' + (item.id === this.props.selectedSubmissionId ? 'active' : '')}>
                            <button onClick={this.props.changeSubmissionById.bind(this, item.id)}>⭯</button>
                            <OverlayTrigger trigger="focus" 
                                            placement="top" 
                                            overlay={this.createPopover(item.version, item.result, item.commitHash )}>
                                <button>ⓘ</button>
                            </OverlayTrigger> Version {item.version + 1} 
                            <br />
                            <small>
                                { Util.timeFormatter(item.timestamp) }
                            </small>
                        </div>
                    </li>)}
                </ul>
            </div>
        );
    }

}

export default VersionList;