import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ExportModal = ({ showModal, handleClose, assignmentExport, assignmentTitle = 'Assignment' }) => (
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

            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} json/>
            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} csv/>

        </Modal.Footer>
    </Modal>
);

const DownloadButton = ({ assignmentExport, assignmentTitle, json = false, csv = false }) => {
    const filename = encodeURIComponent(assignmentTitle.replace(/ /g, '_'));
    let extension = '';
    let content = '';
    if (json) {
        extension = '.json';
        content = toJson(assignmentExport);
    } else if (csv) {
        extension = '.csv';
        content = toCsv(assignmentExport);
    }

    return (
        <a href={content}
           download={filename + extension}>
            <Button variant="primary">
                Export to {extension}
            </Button>
        </a>
    );
};

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

const toJson = (assignmentExport) => {
    if (!assignmentExport) {
        return;
    }
    return 'data:text/json,' + encodeURIComponent(JSON.stringify(assignmentExport));
};

const toCsv = (assignmentExport) => {
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

ExportModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    assignmentExport: PropTypes.object.isRequired,
    assignmentTitle: PropTypes.string.isRequired,
};

ResultTable.propTypes = {
    assignmentExport: PropTypes.object.isRequired,
};

export { ExportModal, ResultTable };