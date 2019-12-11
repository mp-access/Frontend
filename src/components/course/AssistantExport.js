import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AdminService from '../../utils/AdminService';

const ExportModal = ({ showModal, handleClose, authorization, courseId, assignmentExport, assignmentTitle = 'Assignment' }) => (
    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{assignmentTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} json/>
            <br/>
            <br/>
            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} csv/>
            <br/>
            <br/>
            <button variant="primary" className='style-btn warn' onClick={() => {
                handleClick(assignmentExport, courseId, authorization);
            }}>
                Re-Evaluation (CARE!)
            </button>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
);

function handleClick(assignmentExport, courseId, authorization) {
    AdminService.reEvaluateSubmissions(courseId, assignmentExport.assignmentId, authorization)
        .catch(error => console.log(error));
}

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
    const { exerciseLabel, byStudents, totalsByStudent } = assignmentExport;
    let str = `"Student",${exerciseLabel.map(id => `"${id}"`)},"total"\n`;

    for (let studentEmail of Object.keys(byStudents)) {
        const submissions = byStudents[studentEmail];
        const totalScore = totalsByStudent[studentEmail];

        str += `"${studentEmail}",` + Object.values(submissions).map((submission) => {
            if (!submission) {
                console.debug('submission is null', studentEmail, submissions, submission, totalScore);
            }
            return submission ? submission.score : 0;
        }).join(',') + `,${totalScore}\n`;
    }

    return 'data:text/csv,' + encodeURIComponent(str);
};

ExportModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    assignmentExport: PropTypes.object.isRequired,
    assignmentTitle: PropTypes.string.isRequired,
};

export { ExportModal };