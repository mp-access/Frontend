import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios'

const ExportModal = ({showModal, handleClose, courseId, assignmentExport, assignmentTitle = 'Assignment'}) => (
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
            <button variant="primary" className='style-btn warn' onClick={() => {handleClick({assignmentExport}, courseId)}}>
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

function handleClick(assignmentExport, courseId) {
    //get request
    //axios is promise based, we could make a fire&forget out of it? Does backend return anything?
    axios.get('/api/admins/courses/' + courseId + '/assignments/' + assignmentExport.assignmentExport.assignmentId + '/reevaluate')
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        });
}

const DownloadButton = ({assignmentExport, assignmentTitle, json = false, csv = false}) => {
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
    const {exerciseIds, byStudents, totalsByStudent} = assignmentExport;
    let str = `"Student",${exerciseIds.map(id => `"${id}"`)},"total"\n`;

    for (let studentEmail of Object.keys(byStudents)) {
        const submissions = byStudents[studentEmail];
        const totalScore = totalsByStudent[studentEmail];

        str += `"${studentEmail}",` + Object.values(submissions).map((submission) => submission.score).join(',') + `,${totalScore}\n`;
    }

    return 'data:text/csv,' + encodeURIComponent(str);
};

ExportModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    assignmentExport: PropTypes.object.isRequired,
    assignmentTitle: PropTypes.string.isRequired,
};

export {ExportModal};