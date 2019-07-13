import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import './CodeExercise.css';
import SubmissionService from '../../utils/SubmissionService';
import CodeEditor from '../exercise/CodeEditor';
import Logger from './Logger.js';

class CodeSnippetExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: undefined
        };
    }

    componentDidMount = async () => {
        const { authorizationHeader, exercise } = this.props;

        const submission = await this.fetchLastSubmission(exercise.id, authorizationHeader);

        if(submission) {
            this.setState({
                file: submission.publicFiles[0],
            });
        }else{
            this.setState({
                file: exercise.public_files[0],
            });
        }
    };

    componentDidUpdate = async (prevProps) => {
        /*
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
        */
    } 

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
        /*
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

                const myheaders = {
                    headers: {...headers},
                }
                const submission = await this.fetchSubmissionById(submissionId, myheaders);
                const workspace = new Workspace(this.state.workspace.exercise, submission);
    

                this.setState({
                    workspace
                });
            }
        }, 100);
        */
    };

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        this.setState( prevState => ({
            file: {
                 ...prevState.file, 
                 content: newValue 
            }
        }));
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
        const file = this.state.file;
        const workspace = this.props.workspace;

        if (!file) {
            return null;
        }

        const outputConsole = workspace.submission ? workspace.submission.console : undefined;

        const { content, extension } = file;
        const language = extensionLanguageMap[extension];

        const editorOptions = this.editorOptions(file.readOnly);

        let consoleLog = <Logger 
                                log={outputConsole ? outputConsole.stdout.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''} 
                                err={outputConsole ? outputConsole.stderr.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''} 
                                />;
        
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="border-secondary">
                            <ReactMarkdown source={workspace.question}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <CodeEditor content={content} language={language} options={editorOptions}
                                        onChange={this.onChange} onRun={this.submitButtonClick}/>
                            </div>
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