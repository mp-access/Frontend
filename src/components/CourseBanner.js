import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class CourseBanner extends Component {

    render() {
        const {course} = this.props;
        return (
            <div className="panel v-flex">
                <div className="row">
                    <div className="col-md-9 col-12">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                    </div>
                    <div className="col-md-3 col-12 h-flex">
                        <Link className="style-btn full" to={`/courses/${course.id}`}>Take Course</Link>
                    </div>
                </div>
            </div>
        );
    }

}

export default CourseBanner;