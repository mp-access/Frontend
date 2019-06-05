import React, {Component} from 'react';
import MonacoEditor from "react-monaco-editor";
import ReactMarkdown from "react-markdown";

class CodeExercise extends Component {

    //monaco editor
    editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        editor.focus();
        console.log(monaco);
    };

    onChange = (newValue, e) => {
        console.log('onChange', newValue, e);
    };

    //setting code editor language within tabs
    setPython = () => this.setState({language: 'python'});
    setJs = () => this.setState({language: 'javascript'});

    setCode = (code) => this.setState({code: code});

    setTab = (extension, code) => {
        if (extension === 'py') {
            this.setPython();
        } else if (extension === 'js') {
            this.setJs();
        }
        this.setCode(code);
    };


    render() {
        const exercise = this.props.exercise;
        const options = {selectOnLineNumbers: true,};

        console.debug(exercise);

        return (
            <div>

                <ReactMarkdown source={exercise.question}/>

                <div className="border">
                    <MonacoEditor
                        height="450px"
                        language="python"
                        value={exercise.content}
                        automaticLayout={true}
                        options={options}
                        quickSuggestions={true}
                        snippetSuggestions={true}
                        wordBasedSuggestions={true}
                    />
                </div>
            </div>
        );
    }

}

export default CodeExercise;