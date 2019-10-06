import React, { Component } from 'react';
import CodeEditor from './exercise/CodeEditor';
import CourseDataService from '../utils/CourseDataService';
import Spinner from './core/Spinner';
import './MediaViewer.css';
import MarkdownViewer from './MarkdownViewer';
import { Download, File } from 'react-feather';

class MediaViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mediaBlob: undefined,
        };
    }

    componentDidMount = async () => {
        this.loadMediaFile();
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.selectedFile !== this.props.selectedFile) {
            this.loadMediaFile();
        }
    };

    loadMediaFile = async () => {
        const { exerciseId, selectedFile, authorizationHeader } = this.props;
        const showQuestion = selectedFile.title === 'description.md';
        const mediaType = mediaTypeMap[selectedFile.extension];
        let content;

        if (this.isResourceFile(showQuestion, mediaType)) {
            content = await this.fetchExerciseFile(exerciseId, selectedFile.id, authorizationHeader);
        } else {
            content = new Blob([selectedFile.content], { type: 'plain/text' });
        }

        this.setState({
            mediaBlob: URL.createObjectURL(content),
            blobSizeKb: content.size / 1000,
        });
    };

    isResourceFile = (isQuestion, mediaType) => {
        return !isQuestion && mediaType !== 'code';
    };

    fetchExerciseFile = async (exerciseId, fileId, authHeader) => {
        return await CourseDataService.getExerciseFile(exerciseId, fileId, authHeader)
            .catch(err => console.error(err));
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
        const { mediaBlob, blobSizeKb } = this.state;
        const { selectedFile, workspace, onChange, isDark, authorizationHeader } = this.props;

        const { content, title, extension, readOnly } = selectedFile;
        const mediaType = mediaTypeMap[extension];
        const language = extensionLanguageMap[extension];
        const showQuestion = title === 'description.md';
        const editorOptions = this.editorOptions(readOnly);
        const exportFile = (
            <a href={mediaBlob}
               download={title}>
                <button className="style-btn download">
                    <Download size={14}/>
                </button>
            </a>
        );

        let viewport;

        if (showQuestion) {
            viewport = <MarkdownViewer markdown={workspace.question} authHeader={authorizationHeader}
                                       exerciseId={workspace.exerciseId}/>;
        } else {
            if (mediaType === 'code') {
                viewport = <CodeEditor content={content} language={language} options={editorOptions} onChange={onChange}
                                       isDark={isDark}/>;
            } else if (mediaType === 'img') {
                if (mediaBlob !== undefined) {
                    viewport = <img src={mediaBlob} alt={title}/>;
                } else {
                    viewport = <div className="loading-box"><Spinner text={'Loading...'}/></div>;
                }
            } else {
                viewport = (
                    <div className={'media-viewer-unsupported'}>
                        <File size={100}/>
                        <p>
                            <strong>.{extension}</strong> files can't be previewed
                        </p>
                        <p>
                            <small>{title} - {blobSizeKb} KB</small>
                        </p>
                    </div>
                );
            }
        }

        return (
            <>
                <h4>
                    {selectedFile.name + '.' + selectedFile.extension}
                    <span style={{ marginLeft: '15px', fontSize: 15 }}>
                        {exportFile}
                    </span>
                </h4>
                <div className="media-viewport">
                    {viewport}
                </div>
            </>
        );
    }
}

const mediaTypeMap = {
    'py': 'code',
    'js': 'code',
    'css': 'code',
    'json': 'code',
    'md': 'code',
    'c': 'code',
    'cpp': 'code',
    'h': 'code',
    'java': 'code',
    'txt': 'code',

    'png': 'img',
    'jpg': 'img',
    'jpeg': 'img',
    'gif': 'img',
    'svg': 'img',
};

const extensionLanguageMap = {
    'py': 'python',
    'js': 'javascript',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'c': 'c',
    'cpp': 'cpp',
    'h': 'cpp',
    'txt': 'text',
    'java': 'java',
};

export default MediaViewer;
