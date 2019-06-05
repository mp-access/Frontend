export default class Course {
    constructor(json) {
        this.course = '';
        this.student = false;
        this.author = false;
        Object.assign(this, json);
    }

}