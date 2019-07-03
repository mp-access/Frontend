import SubmissionService from "../../utils/SubmissionService";
import React, {Component} from 'react';

import "./VersionList.css"
import equal from 'fast-deep-equal'

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

    timeFormatter(time){
        return time.split(".")[0].replace("T", " ");
    }

    render() {
        const items = this.state.items || [];

        return (
            <div id={"version-wrapper"}>
                <ul>
                    <li><button onClick={this.props.changeSubmissionId.bind(this, -1)}>⭯</button> Revert Template</li>
                    <li><hr/></li>
                    {items.map(item => <li key={item.id}>
                        <div>
                            <button onClick={this.props.changeSubmissionId.bind(this, item.id)}>⭯</button> Version {item.version + 1}
                            <br />
                            <small>{ this.timeFormatter(item.timestamp) }</small>
                        </div>
                    </li>)}
                </ul>
            </div>
        );
    }

}

export default VersionList;