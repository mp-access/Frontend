import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

class ChoiceExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
            singleChoiceValue: '',
            multipleChoiceValue: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async () => {
        const {exercise} = this.props;

        try {
            if (this.props.workspace.submission.choice) {
                this.setState({
                    question: exercise.question,
                    options: exercise.options,
                    type: exercise.type,
                    singleChoiceValue: parseInt(this.props.workspace.submission.choice)
                });

            } else if (this.props.workspace.submission.choices) {
                this.setState({
                    question: exercise.question,
                    options: exercise.options,
                    type: exercise.type,
                    multipleChoiceValue: this.props.workspace.submission.choices.slice()
                },);
            }
        } catch (e) {
            this.setState({
                question: exercise.question,
                options: exercise.options,
                type: exercise.type,
            });
        }

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            if (prevProps.workspace !== this.props.workspace) {
                if (this.state.type === 'singleChoice') {
                    this.setState({singleChoiceValue: parseInt(this.props.workspace.submission.choice)})
                } else if (this.state.type === 'multipleChoice') {
                    this.setState({multipleChoiceValue: this.props.workspace.submission.choices.slice()})
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    handleChange(event) { //add options to array or remove them if option is unchecked again by user
        if (this.state.type === 'singleChoice') {
            this.setState({singleChoiceValue: parseInt(event.target.value)});
        } else if (this.state.type === 'multipleChoice') {
            let multipleChoiceArray = this.state.multipleChoiceValue;
            if (this.state.multipleChoiceValue.includes(parseInt(event.target.value))) {
                multipleChoiceArray = multipleChoiceArray.filter(e => e !== parseInt(event.target.value));
            } else {
                multipleChoiceArray.push(parseInt(event.target.value));
            }
            this.setState({multipleChoiceValue: multipleChoiceArray});
        }
    }

    getPublicFiles = () => {
        if (this.state.type === 'singleChoice') {
            let type = "singleChoice";
            return {
                type: type,
                value: this.state.singleChoiceValue
            };
        } else if (this.state.type === 'multipleChoice') {
            let type = "multipleChoice";
            return {
                type: type,
                value: this.state.multipleChoiceValue
            };
        }
    };

    render() {
        let options = [];
        let optionsLength = 0;
        let type = "";
        let name = "";
        let id = "";
        if (this.state.options) {
            optionsLength = this.state.options.length;
        }
        if (this.state.type === 'multipleChoice') {
            type = "checkbox";
            name = "multipleChoiceOption";
        } else if (this.state.type === 'singleChoice') {
            type = "radio";
            name = "singleChoiceOption";
        }

        for (let i = 0; i < optionsLength; i++) {
            id = escape(this.state.options[i]);
            if (type === "checkbox") {
                try {
                    options.push(
                        <div className="question-elemtn" key={i}>
                            <input type={type} name={name} value={i} id={id} onChange={this.handleChange}
                                   checked={this.state.multipleChoiceValue.includes(i)}/>
                            <label htmlFor={id}> {this.state.options[i]}</label>
                        </div>
                    );
                } catch (e) {
                    options.push(
                        <div className="question-elemtn" key={i}>
                            <input type={type} name={name} value={i} id={id} onChange={this.handleChange}/>
                            <label htmlFor={id}> {this.state.options[i]}</label>
                        </div>
                    );
                }
            } else {
                try {
                    options.push(
                        <div className="question-elemtn" key={i}>
                            <input type={type} name={name} value={i} id={id} onChange={this.handleChange}
                                   checked={i === this.state.singleChoiceValue}/>
                            <label htmlFor={id}> {this.state.options[i]}</label>
                        </div>
                    );
                } catch (e) {
                    options.push(
                        <div className="question-elemtn" key={i}>
                            <input type={type} name={name} value={i} id={id} onChange={this.handleChange}/>
                            <label htmlFor={id}> {this.state.options[i]}</label>
                        </div>
                    );
                }
            }
        }

        return (

            <>
                <div className="row">
                    <div className="col-12">
                        <ReactMarkdown source={this.state.question}/>
                    </div>
                    <div className="col-12">
                        <form>
                            {options}
                        </form>
                    </div>
                </div>
            </>
        )
            ;
    }
}

export default ChoiceExercise;