import utils from '../utils';

class AdminService {

    static async exportAssignmentResults(courseId, assignmentId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/admins/courses/${courseId}/assignments/${assignmentId}/results`, authHeader())
            .then(result => result.json()).catch(error => console.error('Error: ', error));
    }

    static async reEvaluteSubmissions(courseId, assignmentId, authHeader) {
        fetch('/api/admins/courses/' + courseId + '/assignments/' + assignmentId + '/reevaluate', authHeader())
    };
}

export default AdminService;