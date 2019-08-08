import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Util from '../utils/Util';

class AssignmentList extends Component {

    render() {
        const {courseId} = this.props;
        const {assignments} = this.props;

        const listItems = assignments.map((a, index) =>            
            <li key={index}>
                <Link to={`/courses/${courseId}/assignments/${a.id}`}>
                    <strong>Assignment {index + 1} - {a.title}</strong>
                    <br />
                    <small>{Util.timeFormatter(a.dueDate)}</small>
                </Link>
            </li>
        );

        return (
            <ul className="style-list">
                {listItems}
            </ul>
        );
    }

}

export default AssignmentList;