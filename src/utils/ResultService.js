import utils from '../utils';

class ResultService {

    static async getCourseResults(courseId, authHeader) {
        return fetch(utils.courseServiceUrl + '/courses/' + courseId + '/results', authHeader())
            .then(result => result.json()).catch(error => console.error('Error: ', error));
    }

}

export default ResultService;