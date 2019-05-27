import React, {Component} from 'react';

class Course extends Component {

    constructor(props) {
        super(props);
        console.debug(props);

        if (props.course != null) {
            this.id = props.course.id;
            this.name = props.course.title;
            this.description = props.course.description;
            this.owner = props.course.owner;
            this.start = props.course.startDate;
            this.end = props.course.endDate;
        }
    }

   get

    render() {
        if (!this.props.course) {
            return null;
        }

        return (
            <div>
                <h2>{this.name}</h2>
                <p>id: {this.id}</p>
                <p>name: {this.name}</p>
            </div>
        );
    }
}

export default Course;