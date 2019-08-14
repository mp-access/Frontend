import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class CourseBanner extends Component {

    render() {
        const {course} = this.props;
        return (
            <div className="panel v-flex">
                <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                </div>
                <Link className="style-btn" to={`/courses/${course.id}`}>Take Course</Link>
            </div>
        );
    }

}

export default CourseBanner;