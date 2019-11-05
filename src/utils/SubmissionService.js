import utils from '../utils';

class SubmissionService {

    static async getLastSubmission(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        return await fetch(url, authHeader())
            .then(response => {
                return response.text()
            })
            .then((data) => {
                return (data ? JSON.parse(data) : undefined);
            })
            .catch((error) => {
                console.error('Error: ', error)
            });
    }

    static async submit(exerciseId, submission, graded, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        let submissionBody = {
            'type': submission.type,
            'details': undefined,
        };
        if (submission.type === 'code' || submission.type === 'codeSnippet') {
            submissionBody['details'] = {
                'graded': graded,
                'publicFiles': submission.publicFiles,
                'selectedFileId': submission.selectedFileId,
            };
        } else if (submission.type === 'singleChoice') {
            submissionBody['details'] = {
                'graded': graded,
                'choice': submission.value,
            };
        } else if (submission.type === 'multipleChoice') {
            submissionBody['details'] = {
                'graded': graded,
                'choices': submission.value,
            };
        } else if (submission.type === 'text') {
            submissionBody['details'] = {
                'graded': graded,
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
        });
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