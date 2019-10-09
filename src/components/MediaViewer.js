import React, { Component } from 'react';
import CodeEditor from './exercise/CodeEditor';
import CourseDataService from '../utils/CourseDataService';
import Spinner from './core/Spinner';
import './MediaViewer.css';
import MarkdownViewer from './MarkdownViewer';

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


        if (!showQuestion && mediaType !== 'code') {
            const blob = await this.fetchExerciseFile(exerciseId, selectedFile.id, authorizationHeader);
            this.setState({
                mediaBlob: URL.createObjectURL(blob),
            });
        }
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
        const mediaBlob = this.state.mediaBlob;
        const { selectedFile, workspace, onChange, authorizationHeader } = this.props;

        const { content, title, extension, readOnly } = selectedFile;
        const mediaType = mediaTypeMap[extension];
        const language = extensionLanguageMap[extension];
        const showQuestion = title === 'description.md';
        const editorOptions = this.editorOptions(readOnly);

        let viewport;

        if (showQuestion) {
            viewport = <MarkdownViewer markdown={workspace.question} authHeader={authorizationHeader}
                                       exerciseId={workspace.exerciseId}/>;
        } else {
            if (mediaType === 'code') {
                viewport = <CodeEditor content={content} language={language} options={editorOptions} onChange={onChange}
                                       submitCode={this.props.submitCode}/>;
            } else if (mediaType === 'img') {
                if (mediaBlob !== undefined) {
                    viewport = <img src={mediaBlob} alt={title}/>;
                } else {
                    viewport = <div className="loading-box"><Spinner text={'Loading...'}/></div>;
                }
            }
        }

        return (
            <div className="media-viewport">
                {viewport}
            </div>
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
