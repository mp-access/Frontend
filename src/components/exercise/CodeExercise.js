import React, { Component } from 'react';
import FileExplorer from './FileExplorer';
import UserConsole from './UserConsole';
import MediaViewer from '../MediaViewer';
import 'file-icons-js/css/style.css';
import './CodeExercise.css';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            fileExplorerData: undefined,
        };
    }

    componentDidMount = async () => {
        const { exercise, workspace } = this.props;
        const submission = workspace.submission;
        const publicFiles = (submission ? submission.publicFiles : exercise.public_files) || [];

        const questionFile = {
            id: 'question',
            name: 'Question',
            title: 'Question.md',
            content: exercise.question,
            extension: 'md',
            readOnly: true,
        };

        // folders
        const pub_dir = {
            id: 'public_files',
            title: 'Public Files',
            isDirectory: true,
            expanded: true,
            children: [],
        };
        const priv_dir = {
            id: 'private_files',
            title: 'Private Files',
            isDirectory: true,
            children: [],
        };
        const sol_dir = {
            id: 'solution_files',
            title: 'Solution Files',
            isDirectory: true,
            children: [],
        };
        const res_dir = {
            id: 'resource_files',
            title: 'Resource Files',
            isDirectory: true,
            children: [],
        };


        pub_dir.children = mapVirtualFilesToTreeStructure(publicFiles);

        let files = [questionFile]
            .concat(pub_dir)

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

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        const { selectedFile, fileExplorerData } = this.state;

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
        const { workspace, isDark, authorizationHeader } = this.props;
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

        return (
            <>
                <div className="row">
                    <div className="col-2">
                        <FileExplorer data={fileExplorerData} selectedFile={selectedFile}
                                      onChange={this.onFileExplorerChange}
                                      nodeClicked={this.nodeClicked}/>

                    </div>
                    <div className="col-10">
                        <div>
                            <h4>{selectedFile.name + '.' + selectedFile.extension}</h4>
                            <MediaViewer exerciseId={exerciseId} selectedFile={selectedFile} workspace={workspace}
                                         onChange={this.onChange} authorizationHeader={authorizationHeader}
                                         isDark={isDark} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {userConsole}
                    </div>
                </div>
            </>
        );
    }
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