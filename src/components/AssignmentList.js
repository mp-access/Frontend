import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Lock } from 'react-feather';
import { DueDateTime } from './DateTime';

const AssignmentList = ({ courseId, assignments, isAdmin, onAssignmentExportClick, results }) => {
    const listItems = assignments.map((assignment, index) => {
            const pastDueDate = assignment.pastDueDate;
            const result = results ? results.find(r => r.assignmentId === assignment.id) : undefined;

            return (
                <li key={assignment.id} className={"h-flex" + ((result && result.gradedSubmissions.length) || pastDueDate ? '' : ' fresh')}>
                    <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id}
                          className="flex-grow-1">
                        <span>Exercise {index + 1} {pastDueDate ? <Lock size={15}/> : ''}</span>
                        <h5>{assignment.title} </h5>
                        <DueDateTime dueDate={assignment.dueDate}/>
                    </Link>

                        {isAdmin &&
                        <button className="style-btn"
                                onClick={() => onAssignmentExportClick(assignment)}>Export Results</button>}
                    <div>
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
    isAdmin: PropTypes.bool.isRequired,
    result: PropTypes.array,
};


export default AssignmentList;