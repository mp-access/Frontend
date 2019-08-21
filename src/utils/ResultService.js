import utils from '../utils';

class ResultService {

    static async getCourseResults(courseId, authHeader) {
        return fetch(utils.courseServiceUrl + '/students/courses/' + courseId +"/results", authHeader())
            .then(result => result.json());
    }

}

export default ResultService;