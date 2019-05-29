import React, {Component} from 'react';
import MonacoEditor from 'react-monaco-editor';
import utils from "../utils";


class Code extends Component {

    state = {
        language: 'javascript',
        code: '#type your code... ',
        isLoading: false,
        files : [],
    };

    componentDidMount() {
        this.setState({isLoading: true});

        this.fetchMyExercise()
            .then(() => this.setState({isLoading: false}));
    }

    //refactor query to not be hardcoded to exercise but to receive input argument
    fetchMyExercise = async () => {
        const response = await fetch(utils.courseServiceUrl + '/courses/0/assignments/1/exercises/3/');
        if (response.ok) {
            const content = await response.json();

            //extract public files
            const files = [];

            //iterate public files to fill array
            for (var i = 0; i < content.public_files.length; i++) {
                files.push(content.public_files[i]);
            }

            //set state
            this.setState({files: files});
        }
    };

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
    
    setCode = (code) => this.setState({code : code});

    render() {

        const options = {
            selectOnLineNumbers: true,
        };

        const tabItems = this.state.files.map((c) =>
            <button key={c.name} onClick={() => this.setCode(c.content)}>{c.name + '.' + c.extension}</button>
        );

        return (
            <div className="CodeEditor" style={{width: '100%'}}>

                {/* render files as tabs */}
                {tabItems}

                <MonacoEditor
                    width="100%"
                    height="1000px"
                    language={this.state.language}
                    theme="vs-dark"
                    value={this.state.code}
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