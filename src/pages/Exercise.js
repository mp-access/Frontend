import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import CourseDataService from '../utils/CourseDataService';
import CodeExercise from '../components/CodeExercise';

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

        if (exercise.type === 'code') {
            const authorizationHeader = this.props.context.authorizationHeader();
            content =
                <CodeExercise exercise={exercise} authorizationHeader={authorizationHeader}/>;
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        Exercise list
                    </div>
                    <div className="col-9">
                        {content}
                    </div>
                    <div className="col">
                        Versions
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(Exercise);