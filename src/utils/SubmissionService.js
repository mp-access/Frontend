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
        const url = `${utils.courseServiceUrl}/submissions/exercises/${exerciseId}`;
        const response = await fetch(url, {
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
        });

        if (response.status === 202) {
            console.log('202 - Submission Successful');
            const responseBody = await response.json();
            console.debug(responseBody);
        } else {
            throw new Error('Something went wrong on api server!');
        }
    }

}

export default SubmissionService;