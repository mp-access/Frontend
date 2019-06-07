import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class CourseBanner extends Component {

    render() {
        const {course} = this.props;
        return (
            <div className="card">
                <div className="card-header">Institut für Informatik</div>
                <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <Link className="btn btn-primary" to={`/courses/${course.id}`}>Take Course</Link>
                </div>
            </div>
        );
    }

}

export default CourseBanner;