import React, { PureComponent } from 'react';
import FileExplorer from './FileExplorer';
import UserConsole from './UserConsole';
import MediaViewer from '../MediaViewer';
import 'file-icons-js/css/style.css';
import './CodeExercise.css';
import JSZip from 'jszip';
import CourseDataService from '../../utils/CourseDataService';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Play, Download } from 'react-feather';
import Spinner from '../core/Spinner';
import Util from '../../utils/Util';

class CodeExercise extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            fileExplorerData: undefined,
            runButtonState: false,
        };
    }

    componentDidMount = async () => {
        const { exercise, workspace } = this.props;
        const submission = workspace.submission;
        const publicFiles = (submission ? submission.publicFiles : exercise.public_files) || [];

        const questionFile = {
            id: 'question',
            name: 'description',
            title: 'description.md',
            content: exercise.question,
            extension: 'md',
            readOnly: true,
        };

        // folders
        const pub_dir = {
            id: 'public_files',
            title: 'public',
            isDirectory: true,
            expanded: true,
            children: [],
        };
        const priv_dir = {
            id: 'private_files',
            title: 'private',
            isDirectory: true,
            children: [],
        };
        const sol_dir = {
            id: 'solution_files',
            title: 'solution',
            isDirectory: true,
            children: [],
        };
        const res_dir = {
            id: 'resource_files',
            title: 'resource',
            isDirectory: true,
            children: [],
        };


        pub_dir.children = mapVirtualFilesToTreeStructure(publicFiles);

        let files = [questionFile]
            .concat(pub_dir);

        if (exercise.solution_files) {
            sol_dir.children = mapVirtualFilesToTreeStructure(exercise.solution_files);
            files = files.concat(sol_dir);
        }
        if (exercise.private_files) {
            priv_dir.children = mapVirtualFilesToTreeStructure(exercise.private_files);
            files = files.concat(priv_dir);
        }
        if (exercise.resource_files && exercise.resource_files.length) {
            res_dir.children = mapVirtualFilesToTreeStructure(exercise.resource_files);
            files = files.concat(res_dir);
        }

        const fileExplorerData = files;

        const selectedFileId = sessionStorage.getItem('selectedFile');
        const selectedFile = this.searchInFiles(fileExplorerData, selectedFileId);

        this.setState({
            fileExplorerData,
            selectedFile: !!selectedFile ? selectedFile : questionFile,
        });
    };

    getPublicFiles = () => {
        let type = 'code';
        const { selectedFile, fileExplorerData } = this.state;
        const { children: publicFiles } = fileExplorerData
            .find(folder => folder.id === 'public_files') || { children: [] };

        // If selected file is not inside the publicFolder,
        // just take the first file in the public folder as selected file
        let selectedFileIndex = publicFiles.findIndex(f => f.id === selectedFile.id);
        if (selectedFileIndex < 0) {
            selectedFileIndex = 0;
        }

        sessionStorage.setItem('selectedFile', selectedFile.id);
        return {
            type: type,
            publicFiles: publicFiles,
            selectedFile: selectedFileIndex,
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
        const { selectedFile, fileExplorerData } = this.state;

        this.props.setIsDirty(true);

        const updatedSelectedFile = {
            ...selectedFile,
            content: newValue,
        };

        const updatedExplorerData = fileExplorerData.map(folder => {
            if (folder.id === 'public_files') {
                const updatedPublicFiles = folder.children.map(file => {
                    if (file.id === updatedSelectedFile.id) {
                        return updatedSelectedFile;
                    } else {
                        return file;
                    }
                });
                return {
                    ...folder,
                    children: updatedPublicFiles,
                };
            } else {
                return folder;
            }
        });

        this.setState({
            selectedFile: updatedSelectedFile,
            fileExplorerData: updatedExplorerData,
        });
    };

    onFileExplorerChange = (data) => {
        this.setState({ fileExplorerData: data });
    };

    nodeClicked = (node) => {
        const fileExplorerData = this.state.fileExplorerData.map(n => {
            if (n.id === node.id && n.isDirectory) {
                return {
                    ...n,
                    expanded: !n.expanded,
                };
            } else if (n.id === node.id) {
                return {
                    ...n,
                    active: true,
                };
            }
            return n;
        });

        if (node.isDirectory) {
            this.setState({ fileExplorerData });
        } else {
            const selectedFile = this.searchInFiles(fileExplorerData, node.id);
            this.setState({ selectedFile, fileExplorerData });
        }
    };

    searchInFiles(folder, fileId) {
        for (let i = 0; i < folder.length; ++i) {
            if (folder[i].isDirectory) {
                const ret = this.searchInFiles(folder[i].children, fileId);
                if (ret !== undefined)
                    return ret;
            } else {
                if (folder[i].id === fileId) {
                    return folder[i];
                }
            }
        }
    }

    render() {
        const { workspace, authorizationHeader } = this.props;
        const { selectedFile, fileExplorerData } = this.state;
        const exerciseId = this.props.exercise.id;

        if (!selectedFile || !workspace) {
            return null;
        }

        let outputConsole;
        if (workspace.submission)
            outputConsole = workspace.submission.console;

        let userConsole = <UserConsole
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
                        This button will <strong>run</strong>, <strong>test</strong> and <strong>save</strong> your code
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
                        <button className="style-btn ghost" onClick={this.downloadWorkspace}><Download size={14} />Download Task</button>
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
                    <div className="col-2">
                        <FileExplorer data={fileExplorerData} selectedFile={selectedFile}
                                      onChange={this.onFileExplorerChange}
                                      nodeClicked={this.nodeClicked}/>

                    </div>
                    <div className="col-10">
                        <div>
                            <MediaViewer exerciseId={exerciseId} selectedFile={selectedFile} workspace={workspace}
                                         onChange={this.onChange} authorizationHeader={authorizationHeader}
                                         submitCode={this.onCodeSubmit}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4"></div>
                <div className="row">
                    <div className="col-12">
                        {userConsole}
                    </div>
                </div>
            </>
        );
    }

    downloadWorkspace = async () => {
        const zip = new JSZip();
        const { fileExplorerData } = this.state;
        const { exercise, authorizationHeader } = this.props;
        const exerciseId = exercise.id;

        const workspace = zip.folder('workspace');

        for (const f of fileExplorerData) {
            if (f.isDirectory) {
                const folder = workspace.folder(f.title);
                for (const file of f.children) {
                    const mediaType = Util.MEDIA_TYPE_MAP[file.extension];
                    if (mediaType === 'code') {
                        folder.file(file.nameWithExtension, file.content);
                    } else {
                        const content = await CourseDataService.getExerciseFile(exerciseId, file.id, authorizationHeader);
                        folder.file(file.nameWithExtension, content);
                    }
                }
            } else {
                workspace.file(f.title, f.content);
            }
        }

        zip.generateAsync({ type: 'base64' }).then(function(content) {
            window.location.href = 'data:application/zip;base64,' + content;
        });
    };
}

/**
 * Maps backend virtual files to frontend tree structure.
 *
 * Note: this should be adapted to account for folder structures in future
 * @param virtualFiles
 * @returns {*}
 */
const mapVirtualFilesToTreeStructure = (virtualFiles) => {
    return virtualFiles.map(file => ({
        ...file,
        title: `${file.name}.${file.extension}`,
    }));
};

export default CodeExercise;
