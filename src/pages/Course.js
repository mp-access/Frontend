import React, { Component } from 'react';
import CourseDataService from '../utils/CourseDataService';
import AssignmentList from '../components/AssignmentList';
import AdminService from '../utils/AdminService';
import { ExportModal } from '../components/course/AssistantExport';
import ResultService from '../utils/ResultService';
import { withBreadCrumbsAndAuth } from '../components/BreadCrumbProvider';
import { FromToDateTime } from '../components/DateTime';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: undefined,
            courseResults: undefined,
            showModal: false,
            modalAssignmentTitle: '',
            assignmentExport: undefined,
        };
    }

    componentDidMount() {
        const courseId = this.props.match.params.courseId;
        const { context } = this.props;

        CourseDataService.getCourses(context.authorizationHeader)
            .then(result => {
                const course = result.find(c => c.id === courseId);
                this.setState({ course: course });
                this.props.crumbs.setBreadCrumbs(course.breadCrumbs);
            })
            .catch(err => {
                console.debug('Error:', err.toString());
            });

        ResultService.getCourseResults(courseId, context.authorizationHeader)
            .then(result => this.setState({ courseResults: result }))
            //  .then(result => console.warn(result))
            .catch(err => {
                console.debug('Error:', err.toString());
            });
    }

    componentWillUnmount() {
        this.props.crumbs.setBreadCrumbs([]);
    }

    onAssignmentExportClick = (assignment) => {
        this.setState({
            showModal: true,
            modalAssignmentTitle: assignment.title,
        });

        const assignmentId = assignment.id;
        const courseId = this.state.course.id;
        const { context } = this.props;

        AdminService.exportAssignmentResults(courseId, assignmentId, context.authorizationHeader)
            .then(result => this.setState({ assignmentExport: result }))
            .catch(err => console.error(err));
    };

    closeModal = () => this.setState({ showModal: false });

    render() {
        const { course, assignmentExport, modalAssignmentTitle, showModal, courseResults } = this.state;
        if (!course || !courseResults) {
            return null;
        }

        const { id: courseId, startDate, endDate, assignments, title, description } = course;

        const isCourseAssistant = this.props.context.isCourseAssistant(courseId);

        return (
            <div className="container">
                <div className="panel">
                    <div className="heading">
                        <h2>{title}</h2>
                        <FromToDateTime fromDateTime={startDate} toDateTime={endDate}
                                        toAppend={true}/>
                    </div>
                    <p>{description}</p>
                    <br/>
                    <br/>
                    <div>
                        <AssignmentList courseId={courseId} assignments={assignments}
                                        isAssistant={isCourseAssistant}
                                        onAssignmentExportClick={this.onAssignmentExportClick}
                                        results={courseResults}
                        />
                    </div>

                    {assignmentExport && <ExportModal assignmentTitle={modalAssignmentTitle}
                                                      courseId={courseId}
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