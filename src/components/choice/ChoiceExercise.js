import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

class ChoiceExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
        };
    }

    componentDidMount = async () => {
        const {exercise} = this.props;
        console.log(exercise);

        this.setState({
            question: exercise.question,
            options: exercise.options,
            type: exercise.type
        });
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
                                key={i}/>);
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
                        <form>
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