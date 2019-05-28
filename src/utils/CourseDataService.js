import utils from '../utils';

class CourseDataService {

    constructor() {
        this.courses = new Map();
        //this.fetchCourses();
    }

    async fetchCourses() {
        fetch(utils.courseServiceUrl + '/courses')
            .then(res => res.json())
            .then((result) => {
                console.debug("fetch:");
                console.debug(result);
                this.courses = result.courses;
            })
            .catch(err => {
                console.warn("Error:", err.errstatus, " - Message:", err.toString());
            })
    }

    async getCourses() {
        // console.debug("get courses:");
        // return Promise.resolve(Array.from(this.courses.values()));

        // fetch(utils.courseServiceUrl + '/courses')
        //         //     .then(res => res.json())
        //         //     .then((result) => {
        //         //         console.debug("fetch:");
        //         //         console.debug(result);
        //         //         return result.courses;
        //         //     })
        //         //     .catch(err => {
        //         //         console.warn("Error:", err.errstatus, " - Message:", err.toString());
        //         //         return [];
        //         //     })

        console.debug( fetch(utils.courseServiceUrl + '/courses'));

        return fetch(utils.courseServiceUrl + '/courses');
    }

    static async getCourses() {
        return fetch(utils.courseServiceUrl + '/courses');
    }

    async getCourse(id) {
        return Promise.resolve(this.courses.get(id));
    }

}

export default CourseDataService;