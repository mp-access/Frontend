import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Lock } from 'react-feather';
import { DueDateTime } from './DateTime';

const AssignmentList = ({ courseId, assignments, isAssistant, onAssignmentExportClick, results }) => {
    const listItems = assignments.map((assignment, index) => {
            const pastDueDate = assignment.pastDueDate;
            const label = <><h5>{assignment.title}</h5></>;
            const result = results ? results.find(r => r.assignmentId === assignment.id) : undefined;

            return (
                <li key={assignment.id} className="h-flex">
                    <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id}
                          className="flex-grow-1">
                        <span>Exercise {index + 1} {pastDueDate ? <Lock size={15}/> : ''}</span>
                        {label}
                        <DueDateTime dueDate={assignment.dueDate}/>
                    </Link>
                    <div>
                        {isAssistant &&
                        <button className="style-btn"
                                onClick={() => onAssignmentExportClick(assignment)}>Export Results</button>}
                        {result &&
                        <div className="score-display">
                            <span className="p-1"></span>
                            <span className="style-btn ghost">Score: {result.studentScore} / {result.maxScore}</span>
                        </div>
                        }
                    </div>
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