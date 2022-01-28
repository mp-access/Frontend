import utils from '../utils';

class AdminService {

    static async exportAssignmentResults(courseId, assignmentId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/admins/courses/${courseId}/assignments/${assignmentId}/results`, authHeader())
            .then(result => result.json()).catch(error => console.error('Error: ', error));
    }

    static async reEvaluateSubmissions(courseId, assignmentId, authHeader) {
        fetch('/api/admins/courses/' + courseId + '/assignments/' + assignmentId + '/reevaluate', authHeader())
    };

    static async fetchCourseParticipants(courseId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/admins/courses/${courseId}/participants`, authHeader())
            .then(result => result.json()).catch(error => console.error('Error: ', error));
    }

    static async resetSubmissionsCount(courseId, exerciseId, userId, authHeader) {
        return fetch(`${utils.courseServiceUrl}/admins/courses/${courseId}/exercises/${exerciseId}/users/${userId}/reset`, authHeader())
            .then(response => response.ok).catch(error => console.error('Error: ', error));
    }
}

export default AdminService;