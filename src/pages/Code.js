import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';


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
    };

    editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        //monaco.editor.setTheme('vs-dark');
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
                <p>This is your public-facing component.</p>

                <button onClick={this.setPython}>Python</button>
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