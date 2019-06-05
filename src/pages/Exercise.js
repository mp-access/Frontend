import React, {Component} from 'react';
import {withAuth} from "../auth/AuthProvider";
import CourseDataService from "../utils/CourseDataService";

const ReactMarkdown = require('react-markdown');

class Exercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            excercise: undefined
        }
    }

    componentDidMount() {
        const exerciseId = this.props.match.params.exerciseId;
        (async () => {
            CourseDataService.getExercise(exerciseId)

                .then(res => res.json())
                .then(
                    result => this.setState({excercise: result})
                )
                .catch(err => {
                    console.debug("Error:", err.toString())
                });
        })();
    }

    render() {
        if (!this.state.excercise) {
            return null;
        }

        return (
            <div>
                <h2>{this.state.excercise.id}</h2>

                <div>
                    <ReactMarkdown source={this.state.excercise.question}/>
                </div>
            </div>
        );
    }
}

export default withAuth(Exercise);