import React, { Component } from 'react';
import CourseDataService from '../utils/CourseDataService';
import AssignmentList from '../components/AssignmentList';
import AdminService from '../utils/AdminService';
import { ExportModal } from '../components/course/AssistantExport';
import ResultService from '../utils/ResultService';
import { withBreadCrumbsAndAuth } from '../components/BreadCrumbProvider';
import { FromToDateTime } from '../components/DateTime';
import { Calendar, Home } from 'react-feather';
import Spinner from '../components/core/Spinner';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: undefined,
            courseResults: undefined,
            showModal: false,
            modalAssignmentTitle: '',
            assignmentExport: undefined,
            isLoadingExport: false,
            isLoadingCourse: true,
        };
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        const { context } = this.props;

        CourseDataService.getCourse(courseId, context.authorizationHeader)
            .then(course => {
                this.setState({ course: course, isLoadingCourse: false });
                this.props.crumbs.setBreadCrumbs(course.breadCrumbs);
            })
            .catch(err => console.debug('Error:', err.toString()));

        ResultService.getCourseResults(courseId, context.authorizationHeader)
            .then(result => this.setState({ courseResults: result }))
            .catch(err => console.debug('Error:', err.toString()));
    }

    componentWillUnmount() {
        this.props.crumbs.setBreadCrumbs([]);
    }

    onAssignmentExportClick = (assignment) => {
        this.setState({
            showModal: false,
            modalAssignmentTitle: assignment.title,
        });

        const assignmentId = assignment.id;
        const courseId = this.state.course.roleName;
        const { context } = this.props;

        AdminService.exportAssignmentResults(courseId, assignmentId, context.authorizationHeader)
            .then(result => this.setState({
                showModal: true,
                assignmentExport: result,
            }))
            .catch(err => console.error(err));
    };

    closeModal = () => this.setState({ showModal: false });

    render() {
        const { course, assignmentExport, modalAssignmentTitle, showModal, courseResults, isLoadingCourse } = this.state;
        if (!course || !courseResults) {
            if (!isLoadingCourse && !course) {
                throw new Error('404');
            }

            return <div className="loading-box"><Spinner text={'Loading Courses...'}/></div>;
        }

        const { roleName, startDate, endDate, title, description } = course;

        const isCourseAdmin = this.props.context.isCourseAdmin();

        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h1>{title}</h1>
                        <div className="small-list">
                            <small><Calendar size={12}/> {course.semester}</small>
                            <small><Home size={12}/> {course.owner}</small>
                            <br/>
                            <FromToDateTime fromDateTime={startDate} toDateTime={endDate}
                                            toAppend={true}/>
                        </div>
                    </div>
                    <p>{description}</p>
                    <br/>
                    <br/>
                    <div>
                        <AssignmentList courseId={roleName}
                                        isAdmin={isCourseAdmin}
                                        onAssignmentExportClick={this.onAssignmentExportClick}
                                        courseResults={courseResults}
                                        authorization={this.props.context.authorizationHeader}
                        />
                    </div>

                    {assignmentExport && <ExportModal assignmentTitle={modalAssignmentTitle}
                                                      courseId={roleName}
                                                      assignmentExport={assignmentExport}
                                                      showModal={showModal && !!assignmentExport}
                                                      authorization={this.props.context.authorizationHeader}
                                                      handleClose={this.closeModal}/>
                    }
                </div>
            </div>
        );
    }
}

export default withBreadCrumbsAndAuth(Course);