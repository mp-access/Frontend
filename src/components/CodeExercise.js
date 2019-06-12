import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactMarkdown from 'react-markdown';
import utils from '../utils';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            workspace: [],
        };
    }

    componentDidMount() {
        console.debug(this.props.exercise);
        console.log(this.props.exercise);

        this.setState({
            selectedFile: this.props.exercise.public_files[0],
            workspace: this.props.exercise.public_files,
        });
    }

    select(file) {
        console.debug('select', file);
        this.setState({ selectedFile: file });
    }

    submitButtonClick = () => {
        console.log('Submit Button pressed');
        let workspace = this.state.workspace;

        fetch(utils.courseServiceUrl + '/submissions/' + this.props.exercise.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'type': 'code',
                'details': {
                    'graded': 'true',
                    'publicFiles': workspace,
                },
            }),
        }).then(response => {
            if (response.status === 202) {
                console.log('202 - Submission Successful');
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        }).then(response => {
            console.debug(response);
        }).catch(error => {
            console.error(error);
        });
    };

    //update workspace if code gets edited by user
    onChange = (newValue) => {
        let workspace = this.state.workspace.slice();
        let index = workspace.indexOf(this.state.selectedFile);
        let file = workspace[index];
        file = { ...file, content: newValue };
        workspace[index] = file;
        this.setState(({ workspace, selectedFile: file }));
        console.log(this.state.workspace);
    };

    render() {
        if (!this.state.selectedFile) {
            return null;
        }

        const options = { selectOnLineNumbers: true };

        let files = this.state.workspace.map((f) =>
            <button key={f.id} className="btn btn-light" onClick={() => this.select(f)}>
                {f.name + '.' + f.extension}
            </button>,
        );

        return (
            <div>
                <div className="border border-secondary rounded">
                    <ReactMarkdown source={this.props.exercise.question}/>
                </div>

                <div className="border border-secondary rounded">
                    <div className="btn-group btn-group-sm" role="group" aria-label="files">
                        {files}
                    </div>
                    <div className="border">
                        <MonacoEditor
                            height="450px"
                            language={this.props.exercise.language}
                            value={this.state.selectedFile.content}
                            automaticLayout={true}
                            options={options}
                            quickSuggestions={true}
                            snippetSuggestions={true}
                            wordBasedSuggestions={true}
                            onChange={this.onChange}
                        />

                        <button onClick={this.submitButtonClick}>
                            Testrun
                        </button>
                    </div>
                </div>

            </div>
        );
    }

}

export default CodeExercise;