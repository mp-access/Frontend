import utils from '../utils';

class CourseDataService {

    static async getCourses() {
        return fetch(utils.courseServiceUrl + '/courses');
    }

    static async getAssignment(courseId, assignmentId) {
        return fetch(utils.courseServiceUrl + "/courses/"+ courseId +"/assignments/"+assignmentId);
    }

    static async getExercise(excerciseId) {
        return fetch(utils.courseServiceUrl + "/exercises/"+ excerciseId );
    }

}

export default CourseDataService;