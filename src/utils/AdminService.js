import utils from '../utils';

class AdminService {

    static async exportAssignmentResults(courseId, assignmentId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/admins/courses/${courseId}/assignments/${assignmentId}/results`, authHeader())
            .then(result => result.json());
    }
}

export default AdminService;