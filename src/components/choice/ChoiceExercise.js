import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

class ChoiceExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
        };
    }

    componentDidMount = async () => {
        const { exercise } = this.props;

        this.setState({
            question: exercise.question,
        });
    };

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <ReactMarkdown source={this.state.question}/>
                    </div>
                </div>
            </>
        );
    }
}

export default ChoiceExercise;