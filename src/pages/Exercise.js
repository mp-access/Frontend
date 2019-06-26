import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import CodeExercise from '../components/exercise/CodeExercise';
import CodeSnippetExercise from '../components/exercise/CodeSnippetExercise';
import VersionList from "../components/exercise/VersionList";

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercise: undefined,
        };
    }

    componentDidMount = async () => {
        const exerciseId = this.props.match.params.exerciseId;
        const authorizationHeader = this.props.context.authorizationHeader();

        const exercise = await CourseDataService.getExercise(exerciseId, authorizationHeader);
        this.setState({ exercise });
    };

    render() {
        const { exercise } = this.state;

        if (!exercise) {
            return null;
        }

        let content = <p>unknown exercise type</p>;

        const authorizationHeader = this.props.context.authorizationHeader();
        if (exercise.type === 'code') {
            content = <CodeExercise exercise={exercise} authorizationHeader={authorizationHeader}/>;
        } else if (exercise.type === 'codeSnippet') {
            content = <CodeSnippetExercise exercise={exercise} authorizationHeader={authorizationHeader}/>;
        }

        const versionlist = <VersionList exerciseId={exercise.id} authorizationHeader={authorizationHeader} />;

        return (
            <div className="row">
                <div className="col-sm-2">
                    <div className={"panel"}>
                        <h4>Exercise list</h4>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className={"panel no-pad"}>
                    {content}
                    </div>
                </div>
                <div className="col-sm-2">
                    <div className={"panel"}>
                    <h4>Versions</h4>
                    {versionlist}
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(Exercise);