import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import utils from "../utils";


class Code extends Component {

    state = {
        activeLanguage: 0,
        languages: [
            {
                language: 'python',
                code: '# type your code...',
            },
            {
                language: 'javascript',
                code: '// type your code...',
            },
        ],
        publicFiles: [],
        content : [],
        isLoading: false,
    };

    componentDidMount() {
        this.setState({ isLoading: true });

        this.fetchMyExercise()
            .then(() => this.setState({ isLoading: false }));
    }

    fetchMyExercise = async () => {
        const response = await fetch(utils.courseServiceUrl + '/courses/9ba7b66f-b19b-4778-a483-a880886086c5/assignments/5385e8ee-67da-4ff1-adec-c48421380e30/exercises/4ea5bdea-a56d-4a8b-bd88-33b48554cc45');
        if (response.ok) {
            const content = await response.json();
            this.setState({ content });
            console.log(content);
            this.state.publicFiles = content.public_files;
            this.state.languages[0].code = content.public_files[0].content;
        }
    };

    editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        editor.focus();
        console.log(monaco);
    };

    onChange = (newValue, e) => {
        console.log('onChange', newValue, e);
    };

    setPython = () => this.setState({ activeLanguage: 0 });

    setJs = () => this.setState({ activeLanguage: 1 });

    render() {
        const { languages, activeLanguage } = this.state;
        const { code, language } = languages[activeLanguage];
        const options = {
            selectOnLineNumbers: true,
        };

        return (
            <div className="Welcome" style={{ width: '100%' }}>

                <button onClick={this.setPython}>script.py</button>
                <button onClick={this.setJs}>Javascript</button>

                <MonacoEditor
                    width="100%"
                    height="1000px"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    automaticLayout={true}
                    options={options}
                    quickSuggestions={true}
                    snippetSuggestions={true}
                    wordBasedSuggestions={true}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                />
            </div>
        );
    }
}

export default Code;