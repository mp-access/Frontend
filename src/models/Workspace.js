export default class Workspace {
    constructor(exercise, submission) {
        this.exercise = exercise;
        this.submission = submission;
    }

    get exerciseId() {
        return this.exercise.id;
    }

    get question() {
        return this.exercise.question;
    }

    get submissionId() {
        return !!this.submission ? this.submission.id : '';
    }

    /**
     * If a student has already submitted some code, then show the submission
     * @returns {*|Workspace.publicFiles|*}
     */
    get publicFiles() {
        if (!!this.submission) {
            return this.submission.publicFiles;
        } else {
            return this.exercise['public_files'];
        }
    }

    set publicFiles(publicFiles) {
        if (!!this.submission) {
            this.submission.publicFiles = publicFiles;
        } else {
            this.exercise['public_files'] = publicFiles;
        }
    }

    findFile(fileId) {
        return this.publicFiles.find(f => f.id === fileId);
    }
}