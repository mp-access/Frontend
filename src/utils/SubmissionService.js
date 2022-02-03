import utils from '../utils';

class SubmissionService {

    static async getLastSubmission(exerciseId, userId, authHeader) {
        return await fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}/submissions/users/${userId}/latest`, authHeader())
            .then(response => {
                return response.text();
            })
            .then((data) => {
                return (data ? JSON.parse(data) : undefined);
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }

    static async submit(courseId, exerciseId, userId, submission, graded, authHeader) {
        const url = `${utils.courseServiceUrl}/exercises/${exerciseId}/submissions/users/${userId}/submit`;
        let submissionBody = {
            'type': submission.type,
            'details': { 'graded': graded, 'courseId': courseId }
        };
        if (submission.type === 'code' || submission.type === 'codeSnippet') {
            submissionBody['details']['publicFiles'] = submission.publicFiles;
            submissionBody['details']['selectedFileId'] = submission.selectedFileId;
        } else if (submission.type === 'singleChoice') {
            submissionBody['details']['choice'] = submission.value;
        } else if (submission.type === 'multipleChoice') {
            submissionBody['details']['choices'] = submission.value;
        } else if (submission.type === 'text') {
            submissionBody['details']['answer'] = submission.value;
        }
        return await fetch(url, {
            method: 'POST',
            headers: authHeader().headers,
            body: JSON.stringify(submissionBody),
        }).then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('SubmissionService.js Error submit' + response);
            }
        });
    }


    static async checkEvaluation(exerciseId, evalId, authHeader) {
        const url = `${utils.courseServiceUrl}/exercises/${exerciseId}/submissions/eval/${evalId}`;
        return await fetch(url, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('SubmissionService.js Error check evaluation' + response);
                }
            })
            .catch(error => console.error('Error: ', error));
    }

    static async getSubmission(exerciseId, submissionId, authHeader) {
        return await fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}/submissions/${submissionId}`, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('SubmissionService.js Error getSubmission' + response);
                }
            })
            .catch(error => console.error('Error: ', error));
    }

    static async getSubmissionList(exerciseId, userId, authHeader) {
        return await fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}/submissions/users/${userId}/history`, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('SubmissionService.js Error getSubmissionList' + response);
                }
            }).catch(error => console.error('Error: ', error));
    }

}

export default SubmissionService;