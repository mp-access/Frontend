import utils from '../utils';

class CourseDataService {

    static async getCourses(authHeader) {
        return fetch(utils.courseServiceUrl + '/courses', authHeader);
    }

    static async getAssignment(courseId, assignmentId, authHeader) {
        return fetch(utils.courseServiceUrl + "/courses/"+ courseId +"/assignments/"+assignmentId, authHeader);
    }

    static async getExercise(excerciseId, authHeader) {
        return fetch(utils.courseServiceUrl + "/exercises/"+ excerciseId, authHeader);
    }

}

export default CourseDataService;