import React from 'react';
import { Link } from 'react-router-dom';
import Util from '../utils/Util';
import PropTypes from 'prop-types';
import { Lock, Clock } from 'react-feather';

const AssignmentList = ({ courseId, assignments, isAssistant, onAssignmentExportClick, results }) => {
    const listItems = assignments.map((assignment, index) => {
            const pastDueDate = new Date(assignment.dueDate) < (new Date());
            const label = <><h5>{assignment.title}</h5></>;
            const result = results ? results.find(r => r.assignmentId === assignment.id): undefined;
            return (
                <li key={assignment.id}>
                    <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id}>
                        <span>Assignment {index + 1} {pastDueDate ? <Lock size={12} /> : ''}</span>
                        {label}
                        {isAssistant &&
                            <button className="style-btn float-right"
                            onClick={() => onAssignmentExportClick(assignment)}>Export Results</button>}
                        {result &&
                            <button className="style-btn ghost float-right">Score:  {result.studentScore} / {result.maxScore}</button>
                        }
                        <br />
                        <small><Clock size={12} /> Due date: {Util.timeFormatter(assignment.dueDate)}</small>
                    </Link>
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