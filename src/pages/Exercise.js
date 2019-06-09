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

    componentDidMount() {
        const exerciseId = this.props.match.params.exerciseId;
        const authContext = this.props.context;

        (async () => {
            CourseDataService.getExercise(exerciseId, authContext.authorizationHeader())
                .then(res => res.json())
                .then(
                    result => this.setState({ exercise: result }),
                )
                .catch(err => {
                    console.debug('Error:', err.toString());
                });
        })();
    }

    render() {
        if (!this.state.exercise) {
            return null;
        }

        let ex = this.state.exercise;
        let content = <p>unknown exercise type</p>;

        if (ex.type === 'code') {
            const authorizationHeader = this.props.context.authorizationHeader();
            content = <CodeExercise exercise={ex} authorizationHeader={authorizationHeader}/>;
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