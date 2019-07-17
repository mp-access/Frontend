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
            publicFiles: undefined
        };
    }

    componentDidMount = async () => {
        const { authorizationHeader, exercise } = this.props;

        const submission = await this.fetchLastSubmission(exercise.id, authorizationHeader);

        if(submission) {
            this.setState({
                publicFiles: submission.publicFiles[0],
            });
        }else{
            this.setState({
                publicFiles: exercise.public_files[0],
            });
        }
    };

    componentDidUpdate = async (prevProps) => {
        /*
        if(!equal(this.props.submissionId, prevProps.submissionId))
        {}
        */
    } 

    fetchLastSubmission = (exerciseId, authHeader) => {
        return SubmissionService.getLastSubmission(exerciseId, authHeader)
            .catch(err => console.error(err));
    };

    getPublicFiles = () =>{
        return [this.state.publicFiles];
    }

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        this.setState( prevState => ({
            publicFiles: {
                 ...prevState.publicFiles, 
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
        const publicFiles = this.state.publicFiles;
        const workspace = this.props.workspace;

        console.log("render", workspace);

        if (!publicFiles) {
            return null;
        }

        const outputConsole = workspace.submission ? workspace.submission.console : undefined;

        const { content, extension } = publicFiles;
        const language = extensionLanguageMap[extension];

        const editorOptions = this.editorOptions(publicFiles.readOnly);

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
                        <CodeEditor content={content} language={language} options={editorOptions}
                                onChange={this.onChange} onRun={this.submitButtonClick} height="300px"/>
                        <h4>Output</h4>
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