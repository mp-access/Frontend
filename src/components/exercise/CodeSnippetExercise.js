import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import './CodeExercise.css';
import Workspace from '../../models/Workspace';
import SubmissionService from '../../utils/SubmissionService';
import CodeEditor from '../exercise/CodeEditor';
import equal from 'fast-deep-equal'
import Logger from './Logger.js';

class CodeSnippetExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            workspace: undefined,
            console: '',
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount = async () => {
        document.addEventListener('keydown', this.handleKeyDown);

        const { authorizationHeader, exercise } = this.props;

        const submission = await this.fetchLastSubmission(exercise.id, authorizationHeader);
        const workspace = new Workspace(exercise, submission);

        this.setState({
            workspace,
            selectedFile: workspace.publicFiles[0],
        });
    };

    componentDidUpdate = async (prevProps) => {
        if(!equal(this.props.submissionId, prevProps.submissionId))
        {
            const { authorizationHeader, exercise, submissionId } = this.props;

            if(submissionId === -1){
                const workspace = new Workspace(exercise);

                this.setState({
                    workspace,
                    selectedFile: workspace.publicFiles[0]
                });                
            }
            else
            {
                const submission = await this.fetchSubmissionById(submissionId, authorizationHeader);
                const workspace = new Workspace(exercise, submission);
    
                this.setState({
                    workspace,
                    selectedFile: workspace.publicFiles[0]
                });
            }
        }
    } 

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.handleKeyDown);
    };

    fetchLastSubmission = (exerciseId, authHeader) => {
        return SubmissionService.getLastSubmission(exerciseId, authHeader)
            .catch(err => console.error(err));
    };

    fetchSubmissionById = (submissionId, authHeader) => {
        return SubmissionService.getSubmission(submissionId, authHeader)
            .catch(err => console.error(err));
    };

    onFileSelected(file) {
        this.setState({ selectedFile: file });
    }

    submitButtonClick = async () => {
        console.log('Submit Button pressed');
        let { workspace } = this.state;
        const { headers } = this.props.authorizationHeader;

        let codeResponse = await SubmissionService.submitCode(workspace.exerciseId, workspace, headers)
            .catch(err => console.error(err));

        const intervalId = setInterval(async () => {
            let evalResponse = await SubmissionService.checkEvaluation(codeResponse.evalId, headers);
            if ('ok' === evalResponse.status) {
                const submissionId = evalResponse.submission;
                console.debug(submissionId);
                clearInterval(intervalId);

                let submissionResponse = await SubmissionService.getSubmission(submissionId, headers);
                console.debug(submissionResponse);
                this.setState({ console: submissionResponse.console.stderr });
            }
        }, 100);
    };

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        const { selectedFile } = this.state;

        const { workspace } = this.state;
        let files = workspace.publicFiles.slice();
        let index = files.indexOf(selectedFile);
        let file = files[index];
        file = { ...file, content: newValue };
        files[index] = file;
        const updatedWorkspace = Object.assign(new Workspace(), workspace);
        updatedWorkspace.publicFiles = files;
        this.setState(({ workspace: updatedWorkspace, selectedFile: file }));

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

    handleKeyDown(e) {
        // Any key ctrl + [0, 9] || cmd + [0, 9]
        if ((e.ctrlKey || e.metaKey) && e.which >= 48 && e.which <= 57) {
            e.preventDefault();
            let index = e.which - 48;
            this.selectFileByIndex(index);
        }
    };

    selectFileByIndex = (index) => {
        if (index === 1 || index === 0) {
            this.setState({ selectedFile: this.state.fileExplorerData[0] });
        } else {
            index = Math.min(index, this.state.workspace.publicFiles.length + 1);
            const selectedFile = this.state.workspace.publicFiles[index - 2];
            this.setState({ selectedFile });
        }
    };

    render() {
        const { selectedFile, workspace } = this.state;
        const outputConsole = this.state.console;

        if (!selectedFile || !workspace) {
            return null;
        }

        const { content, extension } = selectedFile;
        const language = extensionLanguageMap[extension];

        const editorOptions = this.editorOptions(selectedFile.readOnly);

        let fileTabs = workspace.publicFiles.map((f) => {
                const isSelected = f.id === selectedFile.id;
                return (
                    <button key={f.id}
                            className={`btn code-editor-workspace-tab ${isSelected ? 'active' : ''}`}
                            onClick={() => this.onFileSelected(f)}>
                        {f.name + '.' + f.extension}
                    </button>
                );
            },
        );

        let consoleLog = <Logger log={outputConsole ? outputConsole.split('\n').map(s => <p key={s}>{s}</p>) : ''} />;
        
        return (
            <>
                <div className="row border border-secondary rounded">
                    <div className="col-12">
                        <ReactMarkdown source={workspace.question}/>
                    </div>
                </div>

                <div className="row border border-secondary rounded code-editor-workspace">

                    <div className="col-12">
                        <div className={'row d-flex justify-content-between'}>

                            <div className="btn-group btn-group-sm" role="group" aria-label="files">
                                {fileTabs}
                            </div>

                        </div>

                        <div className="row">
                            <CodeEditor content={content} language={language} options={editorOptions}
                                        onChange={this.onChange} onRun={this.submitButtonClick}/>
                        </div>

                        <div className="row">
                            {consoleLog}
                        </div>
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