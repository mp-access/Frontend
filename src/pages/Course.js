import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import AssignmentList from '../components/AssignmentList';
import Util from '../utils/Util';
import AdminService from '../utils/AdminService';
import { Button, Modal, Table } from 'react-bootstrap';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: undefined,
            showModal: false,
            modalAssignmentTitle: '',
            assignmentExport: undefined,
        };
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        const { context } = this.props;

        CourseDataService.getCourses(context.authorizationHeader())
            .then(result => this.setState({ course: result.find(c => c.id === courseId) }))
            .catch(err => {
                console.debug('Error:', err.toString());
            });
    }

    onAssignmentExportClick = (assignment) => {
        this.setState({
            showModal: true,
            modalAssignmentTitle: assignment.title,
        });

        const assignmentId = assignment.id;

        console.log(this.state.course, assignmentId);
        const courseId = this.state.course.id;
        const { context } = this.props;

        AdminService.exportAssignmentResults(courseId, assignmentId, context.authorizationHeader())
            .then(result => this.setState({ assignmentExport: result }))
            .catch(err => console.error(err));
    };

    closeModal = () => this.setState({ showModal: false });

    render() {
        const { course } = this.state;
        if (!course) {
            return null;
        }

        const courseAccesses = this.props.context.courseAccess();

        return (
            <div className="container">
                <h2>{course.title}</h2>

                <div>
                    <p>{course.description}</p>
                    <small>Open from: <strong>{Util.timeFormatter(course.startDate)}</strong> -
                        to: <strong>{Util.timeFormatter(course.endDate)}</strong></small>

                    <br/><br/>
                </div>

                <div>
                    <AssignmentList courseId={course.id} assignments={course.assignments}
                                    isAssistant={courseAccesses[course.title].isAdmin}
                                    onAssignmentExportClick={this.onAssignmentExportClick}
                    />
                </div>

                <ResultModal assignmentTitle={this.state.modalAssignmentTitle}
                             assignmentExport={this.state.assignmentExport}
                             showModal={this.state.showModal && !!this.state.assignmentExport}
                             handleClose={this.closeModal}/>
            </div>
        );
    }
}

const ResultModal = ({ showModal, handleClose, assignmentExport, assignmentTitle = 'Assignment' }) => (
    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>'{assignmentTitle}' results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ResultTable assignmentExport={assignmentExport}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>

            <a href={buildJson(assignmentExport)}
               download={'results.json'}>
                <Button variant="secondary">
                    Export to .json
                </Button>
            </a>

            <a href={buildCsv(assignmentExport)}>
                <Button variant="primary">
                    Export to .csv
                </Button>
            </a>
        </Modal.Footer>
    </Modal>
);

const ResultTable = ({ assignmentExport }) => {
    if (!assignmentExport) {
        return;
    }

    const { exerciseIds, byStudents } = assignmentExport;

    return (
        <Table striped bordered hover size="sm">
            <thead>
            <tr>
                <th>Student</th>
                {exerciseIds.map(id => <th key={id}>{id}</th>)}
            </tr>
            </thead>
            <tbody>
            {Object.keys(byStudents).map(studentEmail => {
                const submissions = byStudents[studentEmail];
                return (
                    <tr key={studentEmail}>
                        <td>{studentEmail}</td>
                        {Object.values(submissions).map((submission, index) => <td
                            key={studentEmail + '-' + index}>{submission.score}</td>)}
                    </tr>
                );
            })}
            </tbody>
        </Table>
    );
};

const buildJson = (assignmentExport) => {
    if (!assignmentExport) {
        return;
    }
    return 'data:text/json,' + encodeURIComponent(JSON.stringify(assignmentExport));
};

const buildCsv = (assignmentExport) => {
    if (!assignmentExport) {
        return;
    }
    const { exerciseIds, byStudents } = assignmentExport;
    let str = `"Student",${exerciseIds.map(id => `"${id}"`)}\n`;

    for (let studentEmail of Object.keys(byStudents)) {
        const submissions = byStudents[studentEmail];
        str += `"${studentEmail}",` + Object.values(submissions).map((submission) => submission.score).join(',') + '\n';
    }

    return 'data:text/csv,' + encodeURIComponent(str);
};

export default withAuth(Course);