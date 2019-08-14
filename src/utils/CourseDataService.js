import utils from '../utils';

class CourseDataService {

    static async getCourses(authHeader) {
        return fetch(utils.courseServiceUrl + '/courses', authHeader())
            .then(result => result.json());
    }

    static async getAssignment(courseId, assignmentId, authHeader) {
        return fetch(utils.courseServiceUrl + '/courses/' + courseId + '/assignments/' + assignmentId, authHeader())
            .then(result => result.json());
    }

    static async getExercise(exerciseId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}`, authHeader())
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            });
    }

    static async getExerciseFile(exerciseId, fileId, authHeader) {
        return fetch(utils.courseServiceUrl + '/exercises/' + exerciseId + "/files/" + fileId, authHeader())
            .then(result => result.blob());
    }

}

export default CourseDataService;