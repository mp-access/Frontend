import utils from '../utils';

class SubmissionService {

    static async getLastSubmission(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        return await fetch(url, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('SubmissionService.js Error getting last submission' + response);
                }
            }).catch(error => console.error('Error: ', error));
    }

    static async submit(exerciseId, submission, graded, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exs/${exerciseId}`;
        let submissionBody = {
            'type': submission.type,
            'details': undefined,
        };
        if (submission.type === 'code' || submission.type === 'codeSnippet') {
            submissionBody['details'] = {
                'graded': graded,
                'publicFiles': submission.publicFiles,
                'selectedFile': submission.selectedFile,
            };
        } else if (submission.type === 'singleChoice') {
            submissionBody['details'] = {
                'choice': submission.value,
            };
        } else if (submission.type === 'multipleChoice') {
            submissionBody['details'] = {
                'choices': submission.value,
            };
        } else if (submission.type === 'text') {
            submissionBody['details'] = {
                'answer': submission.value,
            };
        }
        return await fetch(url, {
            method: 'POST',
            headers: authHeader().headers,
            body: JSON.stringify(submissionBody),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('SubmissionService.js Error submit' + response);
            }
        }).catch(error => console.error('Error: ', error));
    }


    static async checkEvaluation(evalId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/evals/${evalId}`;
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

    static async getSubmission(submissionId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/${submissionId}`;
        return await fetch(url, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('SubmissionService.js Error getSubmission' + response);
                }
            })
            .catch(error => console.error('Error: ', error));
    }

    static async getSubmissionList(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}/history`;
        return await fetch(url, authHeader())
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