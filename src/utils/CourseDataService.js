import utils from '../utils';

class CourseDataService {

    static async getCourses(authHeader) {
        return fetch(utils.courseServiceUrl + '/courses', authHeader);
    }

    static async getAssignment(courseId, assignmentId, authHeader) {
        return fetch(utils.courseServiceUrl + '/courses/' + courseId + '/assignments/' + assignmentId, authHeader);
    }

    static async getExercise(exerciseId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/exercises/${exerciseId}`, authHeader)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            });
    }

}

export default CourseDataService;