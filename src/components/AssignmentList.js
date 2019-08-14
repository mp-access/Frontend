import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Util from '../utils/Util';
import PropTypes from 'prop-types';

const AssignmentList = ({ courseId, assignments, isAssistant, onAssignmentExportClick }) => {
    const listItems = assignments.map((assignment, index) => {
            const label = `Assignment ${index + 1} - ${assignment.title}`;
            assignment.label = label;
            return (
                <li className="list-group-item" key={assignment.id}>
                    <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id}>
                        <p className="h6">{label}</p>
                        <small>{Util.timeFormatter(assignment.dueDate)}</small>
                    </Link>
                    {isAssistant &&
                    <Button className={'float-right btn-sm'} variant="primary"
                            onClick={() => onAssignmentExportClick(assignment)}>Export student results</Button>}
                </li>
            );
        },
    );

    return (
        <ul className="list-group">
            {listItems}
        </ul>
    );
};

AssignmentList.propTypes = {
    courseId: PropTypes.string.isRequired,
    assignments: PropTypes.array.isRequired,
    isAssistant: PropTypes.bool.isRequired,
};


export default AssignmentList;