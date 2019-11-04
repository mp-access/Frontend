import React, { Component } from 'react';
import CodeEditor from '../exercise/CodeEditor';
import UserConsole from './UserConsole.js';
import './CodeExercise.css';
import MarkdownViewer from '../MarkdownViewer';
import Spinner from '../core/Spinner';
import JSZip from 'jszip';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Download, Play } from 'react-feather';
import Util from '../../utils/Util';
import CourseDataService from '../../utils/CourseDataService';

class CodeSnippetExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publicFiles: undefined,
            runButtonState: false,
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
            selectedFileId: -1,
        };
    };

    onCodeSubmit = () => {
        this.props.submit(false, this.resetRunButton);
        this.setState({ runButtonState: true });
    };

    resetRunButton = () => {
        this.setState({ runButtonState: false });
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

    downloadWorkspace = async () => {
        const zip = new JSZip();
        const { publicFiles } = this.state;
        const { exercise, authorizationHeader } = this.props;
        const exerciseId = exercise.id;

        const workspace = zip.folder('workspace');
        workspace.file('description.md', exercise.question);

        for (const file of publicFiles) {
            const mediaType = Util.MEDIA_TYPE_MAP[file.extension];
            if (mediaType === 'code') {
                workspace.file(file.nameWithExtension, file.content);
            } else {
                const content = await CourseDataService.getExerciseFile(exerciseId, file.id, authorizationHeader);
                workspace.file(file.nameWithExtension, content);
            }
        }

        zip.generateAsync({ type: 'base64' }).then(function(content) {
            window.location.href = 'data:application/zip;base64,' + content;
        });
    };

    render() {
        const publicFiles = this.state.publicFiles;
        const { workspace, authorizationHeader } = this.props;

        if (!publicFiles || publicFiles.length === 0) {
            return null;
        }

        const outputConsole = workspace.submission ? workspace.submission.console : undefined;

        const { content, extension } = publicFiles[0];
        const language = Util.EXTENSION_LANGUAGE_MAP[extension];

        const editorOptions = this.editorOptions(publicFiles.readOnly);

        let consoleLog = <UserConsole
            log={outputConsole ? outputConsole.stdout.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
            err={outputConsole ? outputConsole.testLog.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
            onBottomTab={this.props.onBottomTab}
            currBottomTab={this.props.currBottomTab}
        />;

        let runButtonContent;
        if (this.state.runButtonState) {
            runButtonContent = <Spinner text={'Processing'}/>;
        } else {
            runButtonContent = <>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="testrun-tooltip">
                            This button will <strong>run</strong>, <strong>test</strong> and <strong>save</strong> your
                            code
                        </Tooltip>
                    }
                >
                    <span><Play size={14}/>Test & Run</span>
                </OverlayTrigger>
            </>;
        }

        const buttonCluster = (
            <div className="row">
                <div className="col-sm-12">
                    <div className="code-panel">
                        <button className="style-btn ghost" onClick={this.downloadWorkspace}><Download size={14}/>Download</button>
                        <button className="style-btn" disabled={this.state.runButtonState}
                                onClick={this.onCodeSubmit}>{runButtonContent}</button>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                {buttonCluster}
                <div className="clearfix"></div>
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
                                        onChange={this.onChange} submitCode={this.onCodeSubmit} height="300px"
                            />
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

export default CodeSnippetExercise;