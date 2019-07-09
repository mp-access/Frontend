import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import AssignmentList from '../components/AssignmentList';
import Util from '../utils/Util';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: undefined,
        };
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        const { context } = this.props;

        CourseDataService.getCourses(context.authorizationHeader())
            .then(result => this.setState({ course: result.find(c => c.id === courseId) }))
            .catch(err => {
                console.debug('Error:', err.toString());
            });

    }

    render() {
        if (!this.state.course) {
            return null;
        }

        return (
            <div className="container">
                <h2>{this.state.course.title}</h2>

                <div>
                    <p>{this.state.course.description}</p>
                    <small>Open from: <strong>{Util.timeFormatter(this.state.course.startDate)}</strong> - to: <strong>{Util.timeFormatter(this.state.course.endDate)}</strong></small>
                    <br/><br/>
                </div>

                <div>
                    <AssignmentList courseId={this.state.course.id} assignments={this.state.course.assignments}/>
                </div>
            </div>
        );
    }
}

export default withAuth(Course);