import React, {Component} from 'react';
import SubmissionService from "../../utils/SubmissionService";

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
            <div>
                <ul>
                    {items.map(item => <li key={item.id}><button>⭯</button> Version {item.version}</li>)}
                </ul>
            </div>
        );
    }

}

export default VersionList;