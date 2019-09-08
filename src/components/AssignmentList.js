import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Util from '../utils/Util';
import PropTypes from 'prop-types';
import { Lock } from 'react-feather';

const AssignmentList = ({ courseId, assignments, isAssistant, onAssignmentExportClick, results }) => {
    const listItems = assignments.map((assignment, index) => {
            const pastDueDate = new Date(assignment.dueDate) < (new Date());
            const label = <>Assignment {index + 1} - {assignment.title} {pastDueDate ? <Lock size={14} /> : ''}</>;
            const result = results ? results.find(r => r.assignmentId === assignment.id): undefined;
            return (
                <li key={assignment.id}>
                    <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id}>
                        <strong>{label}</strong>
                        {result &&
                            <button className="style-btn ghost float-right">Score:  {result.studentScore} / {result.maxScore}</button>
                        }
                        <br />
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
        <ul className="style-list">
            {listItems}
        </ul>
    );
};

AssignmentList.propTypes = {
    courseId: PropTypes.string.isRequired,
    assignments: PropTypes.array.isRequired,
    isAssistant: PropTypes.bool.isRequired,
    result: PropTypes.array,
};


export default AssignmentList;