import utils from '../utils';

class SubmissionService {

    static async getLastSubmission(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        const response = await fetch(url, authHeader);
        if (response.ok) {
            return await response.json();
        }
        console.debug(response.toString());
    }

    static async submitCode(exerciseId, workspace, authHeader) {
        //const url = `${utils.courseServiceUrl}/submissions/exs/${exerciseId}`;
        const url = `${utils.courseServiceUrl}/submissions/exs/${exerciseId}`;
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify({
                'type': 'code',
                'details': {
                    'graded': 'false',
                    'publicFiles': workspace.publicFiles,
                },
            }),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    static async checkEvaluation(evalId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/evals/${evalId}`;
        return await fetch(url, {
            headers: { ...authHeader },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
    }

    static async getSubmission(submissionId, authHeader) {
        console.debug('get submission', submissionId);
        const url = `${utils.courseServiceUrl}/submissions/${submissionId}`;
        return await fetch(url, {
            headers: { ...authHeader },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
    }

    static async getSubmissionList(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}/history`;
        const response = await fetch(url, authHeader);
        if (response.ok) {
            return await response.json();
        }
        console.debug(response.toString());
    }

}

export default SubmissionService;