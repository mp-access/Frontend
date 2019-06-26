import SubmissionService from "../../utils/SubmissionService";
import React, {Component} from 'react';

import "./VersionList.css"

class VersionList extends Component {

    state = { items:[] }

    componentDidMount = async () => {
        const {exerciseId} = this.props;
        const {authorizationHeader} = this.props;

        const items = await SubmissionService.getSubmissionList(exerciseId, authorizationHeader);
        this.setState({items: items.submissions});
    }

    render() {
        const items = this.state.items || [];
        return (
            <div id={"version-wrapper"}>
                <ul>
                    <li><button>Load Template</button></li>
                    <li><hr/></li>
                    {items.map(item => <li key={item.id}><button>⭯</button> Version {item.version}</li>)}
                </ul>
            </div>
        );
    }

}

export default VersionList;