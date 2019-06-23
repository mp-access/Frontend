import React, {Component} from 'react';
import {withAuth} from '../auth/AuthProvider';
import CourseBanner from "../components/CourseBanner";
import CourseDataService from "../utils/CourseDataService";

class Courses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        };
    }

    componentDidMount() {
        const { context } = this.props;
        (async () => {
            CourseDataService.getCourses(context.authorizationHeader())
                .then(res => res.json())
                .then(
                    result => this.setState({courses: result})
                )
                .catch(err => {
                    console.debug("Error:", err.toString())
                });
        })();

    }

    render() {
        const listItems = this.state.courses.map((c) =>
            <div className="col-sm-3" key={c.id}>
                <CourseBanner course={c}/>
            </div>
        );

        return (
            <div className="dddd">
                <div>
                    <h2>My Courses</h2>
                    <div className="row">
                        {listItems}
                    </div>
                </div>
            </div>
        );
    }

}

export default withAuth(Courses);