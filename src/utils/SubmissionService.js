import utils from '../utils';

class SubmissionService {

    static async getLastSubmission(exerciseId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        const response = await fetch(url, authHeader);
        console.log(response);
        if (response.status === 200) {
            return await response.json();
        }
        console.debug(response.toString());
    }

    static async submit(exerciseId, submission, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/exs/${exerciseId}`;
        let submissionBody;
        if (submission[0] === "code") {
            submissionBody = JSON.stringify({
                'type': submission[0],
                'details': {
                    'graded': 'false',
                    'publicFiles': submission[1]
                },
            });
        } else if (submission[0] === "singleChoice") {
            submissionBody = JSON.stringify({
                'type': submission[0],
                'details': {
                    'answer': submission[1]
                },
            });
        } else if (submission[0] === "multipleChoice") {
            submissionBody = JSON.stringify({
                'type': submission[0],
                'details': {
                    'choices': submission[1]
                },
            });
        } else if (submission[0] === "text") {
            submissionBody = JSON.stringify({
                'type': submission[0],
                'details': {
                    'answer': submission[1]
                },
            });
        }
        return await fetch(url, {
            method: 'POST',
            headers: authHeader.headers,
            body: submissionBody,
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
        return await fetch(url, authHeader)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
    }

    static async getSubmission(submissionId, authHeader) {
        const url = `${utils.courseServiceUrl}/submissions/${submissionId}`;
        return await fetch(url, authHeader)
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
        return await fetch(url, authHeader)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
    }

}

export default SubmissionService;