import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Util from '../utils/Util';

class AssignmentList extends Component {

    render() {
        const {courseId} = this.props;
        const {assignments} = this.props;

        const listItems = assignments.map((a, index) =>
            <Link to={`/courses/${courseId}/assignments/${a.id}`} key={a.id}>
                <li className="list-group-item">
                    <p className="h6">Assignment {index + 1} - {a.title}</p>
                    <small>{Util.timeFormatter(a.dueDate)}</small>
                </li>
            </Link>
        );

        return (
            <ul className="list-group">
                {listItems}
            </ul>
        );
    }

}

export default AssignmentList;