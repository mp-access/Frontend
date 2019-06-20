import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class AssignmentList extends Component {

    render() {
        const {courseId} = this.props;
        const {assignments} = this.props;

        const listItems = assignments.map((a) =>
            <Link to={`/courses/${courseId}/assignments/${a.id}`} key={a.id}>
                <li className="list-group-item"> <p className="h6">{a.title} - {a.description}     [ {a.dueDate} ] </p></li>
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