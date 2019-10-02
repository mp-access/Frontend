import React, { Component } from 'react';
import CodeEditor from '../exercise/CodeEditor';
import UserConsole from './UserConsole.js';
import './CodeExercise.css';
import MarkdownViewer from '../MarkdownViewer';

class CodeSnippetExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publicFiles: undefined,
        };
    }

    componentDidMount = async () => {
        const { workspace } = this.props;
        const publicFiles = workspace.publicFiles;

        this.setState({
            publicFiles,
        });
    };

    getPublicFiles = () => {
        const { publicFiles } = this.state;
        return {
            type: 'codeSnippet',
            publicFiles: publicFiles,
        };
    };

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        this.props.setIsDirty(true);

        const { publicFiles } = this.state;
        const updatedFiles = publicFiles.map((file, index) => {
            if (index === 0) {
                const updateFile = Object.assign({}, publicFiles[0]);
                updateFile.content = newValue;
                return updateFile;
            }

            return file;
        });

        this.setState({ publicFiles: updatedFiles });
    };

    editorOptions = (readOnly) => {
        return {
            readOnly: readOnly,
            selectOnLineNumbers: true,
            wordWrap: true,
            quickSuggestions: true,
            snippetSuggestions: true,
            wordBasedSuggestions: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: {
                enabled: false,
            },
        };
    };

    render() {
        const publicFiles = this.state.publicFiles;
        const { workspace, authorizationHeader } = this.props;

        if (!publicFiles || publicFiles.length === 0) {
            return null;
        }

        const outputConsole = workspace.submission ? workspace.submission.console : undefined;

        const { content, extension } = publicFiles[0];
        const language = extensionLanguageMap[extension];

        const editorOptions = this.editorOptions(publicFiles.readOnly);

        let consoleLog = <UserConsole
            log={outputConsole ? outputConsole.stdout.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
            err={outputConsole ? outputConsole.testLog.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
            onBottomTab={this.props.onBottomTab}
            currBottomTab={this.props.currBottomTab}
        />;

        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="border-secondary">
                            <MarkdownViewer
                                markdown={workspace.question}
                                exerciseId={workspace.exerciseId}
                                authHeader={authorizationHeader}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="media-viewport">
                            <CodeEditor content={content} language={language} options={editorOptions}
                                        onChange={this.onChange} onRun={this.submitButtonClick} height="300px"/>
                        </div>
                    </div>
                </div>
                <div className="p-4"></div>
                <div className="row">
                    <div className="col-12">
                        {consoleLog}
                    </div>
                </div>
            </>
        );
    }
}

/**
 * For a full list see:
 * https://github.com/microsoft/monaco-languages
 * @type {{css: string, md: string, py: string, js: string, json: string}}
 */
const extensionLanguageMap = {
    'py': 'python',
    'js': 'javascript',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
};

export default CodeSnippetExercise;