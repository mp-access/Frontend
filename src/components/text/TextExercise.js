//TODO how is an answer represented/stored/submitted

import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

class TextExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async () => {
        const {exercise} = this.props;
        try {
            this.setState({
                question: exercise.question,
                value: this.props.workspace.submission.answer,
            }, () => console.log(this.state));
        } catch (e) {
            this.setState({
                question: exercise.question,
                value: '',
            });
        }
        console.log("remount");
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.workspace !== this.props.workspace) {
            this.setState({value: this.props.workspace.submission.answer})
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    getPublicFiles = () => {
        let type = "text";
        return {
            type: type,
            value: this.state.value
        };
    };

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <ReactMarkdown source={this.state.question}/>
                    </div>
                    <div className="col-12">
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Answer:
                                <br/>
                                <input type="text" value={this.state.value}
                                       onChange={this.handleChange}/>
                            </label>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default TextExercise;