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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        const {exercise} = this.props;

        this.setState({
            question: exercise.question,
            options: exercise.options,
            type: exercise.type
        });
    };

    handleChange(event) { //add options to array or remove them if unclicked
        if (this.state.type === 'singleChoice') {
            this.setState({singleChoiceValue: event.target.value});
        } else if (this.state.type === 'multipleChoice') {
            let multipleChoiceArray = this.state.multipleChoiceValue;
            if (this.state.multipleChoiceValue.includes(event.target.value)) {
                multipleChoiceArray = multipleChoiceArray.filter(e => e !== event.target.value);
            } else {
                multipleChoiceArray.push(event.target.value);
            }
            this.setState({multipleChoiceValue: multipleChoiceArray});
        }
    }

    handleSubmit(event) {
        if (this.state.type === 'singleChoice') {
            alert('This option has been submitted: ' + this.state.singleChoiceValue);
        } else if (this.state.type === 'multipleChoice') {
            alert('This array of options has been submitted: ' + this.state.multipleChoiceValue);
        }
        event.preventDefault();
    }

    getPublicFiles = () => {
        if (this.state.type === 'singleChoice') {
            return this.state.singleChoiceValue;
        } else if (this.state.type === 'multipleChoice') {
            return this.state.multipleChoiceValue;
        }
    };

    render() {
        let options = [];
        let optionsLength = 0;
        let type = "";
        let name = "";
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
            // note: we add a key prop here to allow react to uniquely identify each
            // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
            options.push(<input type={type} name={name} value={this.state.options[i]}
                                key={i} onChange={this.handleChange}/>);
            options.push(" " + this.state.options[i]);
            options.push(<br/>);
        }

        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <ReactMarkdown source={this.state.question}/>
                    </div>
                    <div className="col-12">
                        <form onSubmit={this.handleSubmit}>
                            {options}
                            <br/>
                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default ChoiceExercise;