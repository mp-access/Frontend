import utils from '../utils';

class CourseDataService {

    static async getCourses(authHeader) {
        return fetch(utils.courseServiceUrl + '/courses', authHeader())
            .then(result => result.json()).catch(error => console.error('Error: ', error));
    }

    static async getAssignment(courseId, assignmentId, authHeader) {
        return fetch(utils.courseServiceUrl + '/courses/' + courseId + '/assignments/' + assignmentId, authHeader())
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            }).catch(error => console.error('Error: ', error));
    }

    static async getExercise(exerciseId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}`, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).catch(error => console.error('Error: ', error));
    }

    static async getExerciseFile(exerciseId, fileId, authHeader) {
        return fetch(utils.courseServiceUrl + '/exercises/' + exerciseId + '/files/' + fileId, authHeader())
            .then(result => {
                if (result.ok) {
                    result.blob();
                } else {
                    console.log('Failed to fetch file', fileId);
                }
            }).catch(error => console.error('Error: ', error));
    }

    static async getExerciseFileByName(exerciseId, name, authHeader) {
        const url = utils.courseServiceUrl + '/exercises/' + exerciseId + '/files/search';
        return fetch(url, {
            method: 'POST',
            headers: authHeader().headers,
            body: JSON.stringify({ 'filename': name }),
        })
            .then(result => result.blob())
            .catch(error => console.error('Error: ', error));
    }

}

export default CourseDataService;