import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios'

const ExportModal = ({showModal, handleClose, courseId, assignmentExport, assignmentTitle = 'Assignment'}) => (
    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>'{assignmentTitle}' results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} json/>
            <br/>
            <br/>
            <DownloadButton assignmentExport={assignmentExport} assignmentTitle={assignmentTitle} csv/>
            <br/>
            <br/>
            <button className='button' onClick={() => {handleClick({assignmentExport}, courseId)}}>
                Rerun all submissions that have the Outdated flag
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
    // declare a request interceptor
    // examine and change HTTP requests from frontend to backend and vice versa
    // useful for a variety of implicit tasks, such as logging and authentication
    axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Request was sent');

        return config;
    }, error => {
        // handle the error
        return Promise.reject(error);
    });

    // declare a response interceptor
    // allows transform of the responses from a server on their way back to the application
    axios.interceptors.response.use((response) => {
        // do something with the response data
        console.log('Response was received');

        return response;
    }, error => {
        // handle the response error
        return Promise.reject(error);
    });


    // the actual post
    axios.post(
        '/admins/courses/' + courseId + '/assignments/' + assignmentExport.assignmentExport.assignmentId + '/reevaluate',
        {},
        {headers: {'Content-Type': 'application/json'}}
    ).then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
    //axios is promise based, we could make a fire&forget out of it? Does backend return anything?
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