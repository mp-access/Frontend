import React, { Component } from 'react';
import 'file-icons-js/css/style.css';
import './CodeExercise.css';
import FileExplorer from './FileExplorer';
import Logger from './Logger';
import MediaViewer from '../MediaViewer';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            fileExplorerData: undefined,
            publicFiles: [],
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount = async () => {
        document.addEventListener('keydown', this.handleKeyDown);

        const {exercise, workspace} = this.props;
        const submission = workspace.submission;
        const publicFiles = (submission ? submission.publicFiles : exercise.public_files);

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
        res_dir.children = mapVirtualFilesToTreeStructure(exercise.resource_files);

        let files = [questionFile]
            .concat(pub_dir)
            .concat(res_dir);

        if (exercise.solution_files) {
            sol_dir.children = mapVirtualFilesToTreeStructure(exercise.solution_files);
            files = files.concat(sol_dir);
        }
        if (exercise.private_files) {
            priv_dir.children = mapVirtualFilesToTreeStructure(exercise.private_files);
            files = files.concat(priv_dir);
        }

        const fileExplorerData = files;

        const selectedFileId = sessionStorage.getItem('selectedFile');
        const selectedFile = publicFiles.find(f => f.id === selectedFileId);

        this.setState({
            fileExplorerData,
            selectedFile: !!selectedFileId ? selectedFile : questionFile,
            publicFiles,
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.handleKeyDown);
    };

    getPublicFiles = () => {
        let type = "code";
        const {publicFiles, selectedFile} = this.state;
        const selectedFileIndex = publicFiles.findIndex(f => f.id === selectedFile.id);
        sessionStorage.setItem('selectedFile', selectedFile.id);
        return {
            type: type,
            publicFiles: publicFiles,
            selectedFile: selectedFileIndex
        };
    };

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        const {selectedFile, publicFiles} = this.state;

        const updatedSelectedFile = {
            ...selectedFile,
            content: newValue,
        };

        const updatedPublicFiles = publicFiles.map(file => {
            if (file.id === updatedSelectedFile.id) {
                return updatedSelectedFile;
            } else {
                return file;
            }
        });

        this.setState({
            publicFiles: updatedPublicFiles,
            selectedFile: updatedSelectedFile,
        });
    };

    onFileExplorerChange = (data) => {
        this.setState({fileExplorerData: data});
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
            this.setState({fileExplorerData});
        } else {
            const selectedFile = this.searchInFiles(fileExplorerData, node.id);
            this.setState({selectedFile, fileExplorerData});
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
            this.setState({selectedFile: this.state.fileExplorerData[0]});
        } else {
            index = Math.min(index, this.state.publicFiles.length + 1);
            const selectedFile = this.state.publicFiles[index - 2];
            this.setState({selectedFile});
        }
    };

    render() {
        const {workspace, isDark} = this.props;
        const { selectedFile, fileExplorerData } = this.state;
        const exerciseId = this.props.exercise.id;

        if (!selectedFile || !workspace) {
            return null;
        }

        let outputConsole;
        if (workspace.submission)
            outputConsole = workspace.submission.console;

        let consoleLog = <Logger
            log={outputConsole ? outputConsole.stdout.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
            err={outputConsole ? outputConsole.stderr.split('\n').map((s, index) => <p key={index}>{s}</p>) : ''}
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
                            <MediaViewer exerciseId={exerciseId} selectedFile={selectedFile} workspace={workspace} onChange={this.onChange} authorizationHeader={this.props.authorizationHeader} isDark={isDark} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h4>Output</h4>
                        {consoleLog}
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