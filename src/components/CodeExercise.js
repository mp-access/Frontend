import React, {Component} from 'react';
import MonacoEditor from "react-monaco-editor";
import ReactMarkdown from "react-markdown";

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

        this.setState({
            selectedFile: this.props.exercise.public_files[0],
            workspace: this.props.exercise.public_files
        });
    }

    select(file) {
        console.debug("select", file);
        this.setState({selectedFile: file});
    }

    render() {
        if (!this.state.selectedFile) {
            return null;
        }

        const options = {selectOnLineNumbers: true,};

        let files = this.state.workspace.map((f) =>
            <button key={f.id} className="btn btn-light" onClick={() => this.select(f)}>
                {f.name + '.' + f.extension}
            </button>
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
                        />
                    </div>
                </div>

            </div>
        );
    }

}

export default CodeExercise;