import React, { Component } from 'react';
import CodeEditor from './exercise/CodeEditor';
import CourseDataService from '../utils/CourseDataService';
import Spinner from './core/Spinner';
import './MediaViewer.css';
import MarkdownViewer from './MarkdownViewer';
import { Download, File } from 'react-feather';
import Util from '../utils/Util';

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
        const mediaType = Util.MEDIA_TYPE_MAP[selectedFile.extension] || unknownMediaType;
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
        return (!isQuestion && mediaType !== 'code') || mediaType === unknownMediaType;
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
        const { selectedFile, workspace, onChange, authorizationHeader } = this.props;

        const { content, title, extension, readOnly } = selectedFile;
        const mediaType = Util.MEDIA_TYPE_MAP[extension];
        const language = Util.EXTENSION_LANGUAGE_MAP[extension];
        const showQuestion = title === 'description.md';
        const editorOptions = this.editorOptions(readOnly);
        const exportFile = (
            <a href={mediaBlob}
               download={title}>
                <button className="style-btn ghost">
                    <Download size={14}/>Download File
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
                                       submitCode={this.props.submitCode}/>;
            } else if (mediaType === 'img') {
                if (mediaBlob !== undefined) {
                    viewport = <img src={mediaBlob} alt={title}/>;
                } else {
                    viewport = <div className="loading-box"><Spinner text={'Loading...'}/></div>;
                }
            } else {
                viewport = (
                    <div className={'media-viewer-unsupported'}>
                        <div className="my-3"><File size={80}/></div>
                        <strong>.{extension}</strong> files can't be previewed
                        <p>
                            <small>{title} - {blobSizeKb} KB</small>
                        </p>
                        {exportFile}
                    </div>
                );
            }
        }

        return (
            <>
                <h4>
                    {selectedFile.name + '.' + selectedFile.extension}
                </h4>
                <div className={"media-viewport" + (!showQuestion && mediaType === 'code' ? ' no-scroll' : '') }>
                    {viewport}
                </div>
            </>
        );
    }
}

const unknownMediaType = 'unknown';

export default MediaViewer;
