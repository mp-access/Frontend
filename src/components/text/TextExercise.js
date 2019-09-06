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

        this.setState({
            question: exercise.question,
            value: ''
        });
    };

    handleChange(event) {
        this.setState({value: event.target.value});
        this.props.handleLoadButton(false);
    }

    getPublicFiles = () => {
        let type = "text";
        return {
            type: type,
            value: this.state.value
        };
    };

    render() {
        let textField = <input type="text" value={this.state.value} onChange={this.handleChange}/>;
        if (this.props.loadButton) {
            try {
                textField =
                    <input type="text" value={this.props.workspace.submission.answer} onChange={this.handleChange}/>
            } catch (e) {
            }
        }
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
                                {textField}
                            </label>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default TextExercise;