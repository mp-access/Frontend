import React, {Component} from 'react';
import {withAuth} from '../auth/AuthProvider';
import {Link} from "react-router-dom";
import CourseDataService from "../utils/CourseDataService";

class Courses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            selected: undefined
        };

        this.courseService = new CourseDataService();
    }

    componentDidMount() {
        this.courseService.getCourses().then(courses => {
                this.setState({courses: courses});
            }
        );
    }

    render() {
        const listItems = this.state.courses.map((c) =>
            <li>
                <Link to={`/courses/${c.id}`}>{c.title} - {c.description}</Link>
            </li>
        );

        return (
            <div className="dddd">
                <div>
                    <p>
                        My Courses:
                    </p>
                    <ul>
                        {listItems}
                    </ul>
                </div>
            </div>
        );
    }

}

export default withAuth(Courses);