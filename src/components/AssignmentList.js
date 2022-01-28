import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Lock } from 'react-feather';
import { DueDateTime } from './DateTime';
import { useFetch } from 'use-http';
import utils from '../utils';

export default function AssignmentList(props) {
    const { courseId, isAdmin, onAssignmentExportClick, courseResults, authorization } = props;
    const assignments = useFetch(utils.courseServiceUrl + '/courses/' + courseId + '/assignments', authorization(), []).data

    if (!assignments)
        return <></>;

    return (
        <ul className="style-list">
            {assignments.map(assignment => {
                const result = courseResults ? courseResults.find(r => r.assignmentId === assignment.id) : undefined
                const isStale = (result && result.gradedSubmissions.length === assignment.exercises.length) || assignment.pastDueDate

                return (
                    <li key={assignment.id}
                        className={'h-flex' + (isStale ? '' : ' fresh')}>
                        <Link to={`/courses/${courseId}/assignments/${assignment.id}`} key={assignment.id} className="flex-grow-1">
                            <span>Exercise {assignment.index} {assignment.pastDueDate ? <Lock size={15}/> : ''}</span>
                            <h5>{assignment.title} </h5>
                            <DueDateTime dueDate={assignment.dueDate}/>
                        </Link>
                        {isAdmin && <button className="style-btn" onClick={() => onAssignmentExportClick(assignment)}>Export Results</button>}
                        {result &&
                            <div className="score-display">
                                <span className="p-1"/>
                                <span className="style-btn ghost">Score: {result.studentScore} / {result.maxScore}</span>
                            </div>
                        }
                    </li>
                )
            }).reverse()}
        </ul>
    )
}

AssignmentList.propTypes = {
    courseId: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    courseResults: PropTypes.array,
}