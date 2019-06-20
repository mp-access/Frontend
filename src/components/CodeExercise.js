import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactMarkdown from 'react-markdown';
import 'file-icons-js/css/style.css';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import FileIcons from 'file-icons-js';
import SortableTree from 'react-sortable-tree';
import './CodeExercise.css';
import Workspace from '../models/Workspace';
import SubmissionService from '../utils/SubmissionService';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            fileExplorerData: demoFiles,
            workspace: undefined,
        };
    }

    componentDidMount = async () => {
        const { authorizationHeader, exercise } = this.props;
        const fileExplorerData = mapVirtualFilesToTreeStructure(exercise['public_files']);

        const submission = await this.fetchLastSubmission(exercise.id, authorizationHeader);
        const workspace = new Workspace(exercise, submission);

        this.setState({
            fileExplorerData,
            workspace,
            selectedFile: workspace.publicFiles[0],
        });

    };

    fetchLastSubmission = (exerciseId, authHeader) => {
        return SubmissionService.getLastSubmission(exerciseId, authHeader)
            .catch(err => console.error(err));
    };

    onFileSelected(file) {
        this.setState({ selectedFile: file });
    }

    submitButtonClick = () => {
        console.log('Submit Button pressed');
        let { workspace } = this.state;
        const { headers } = this.props.authorizationHeader;

        SubmissionService.submitCode(workspace.exerciseId, workspace, headers)
            .catch(err => console.error(err));
    };

    /**
     * Update workspace if code gets edited by user
     */
    onChange = (newValue) => {
        const { workspace } = this.state;
        let files = workspace.publicFiles.slice();
        let index = files.indexOf(this.state.selectedFile);
        let file = files[index];
        file = { ...file, content: newValue };
        files[index] = file;
        const updatedWorkspace = Object.assign(new Workspace(), workspace);
        updatedWorkspace.publicFiles = files;
        this.setState(({ workspace: updatedWorkspace, selectedFile: file }));
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

        const selectedFile = this.state.workspace.findFile(node.id);
        this.setState({ selectedFile, fileExplorerData });
    };

    render() {
        const { selectedFile, workspace, fileExplorerData } = this.state;

        if (!selectedFile || !workspace) {
            return null;
        }

        let files = workspace.publicFiles.map((f) => {
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

        const { content, extension } = selectedFile;
        const language = extensionLanguageMap[extension];
        const options = { selectOnLineNumbers: true };

        return (
            <>
                <div className="row">
                    <div className="border border-secondary rounded">
                        <ReactMarkdown source={workspace.question}/>
                    </div>
                </div>

                <div className="row border border-secondary rounded code-editor-workspace">
                    <div className="col-2">
                        <div className={'row'}>
                            <div className={'col'}>
                                <small className="explorer-label">
                                    EXPLORER
                                </small>
                            </div>
                        </div>

                        <FileExplorer data={fileExplorerData} selectedFile={selectedFile}
                                      onChange={this.onFileExplorerChange}
                                      nodeClicked={this.nodeClicked}/>

                    </div>

                    <div className="col-10">
                        <div className={'row'}>
                            <div className="btn-group btn-group-sm" role="group" aria-label="files">
                                {files}
                            </div>
                        </div>

                        <div className="row">
                            <MonacoEditor
                                height="800px"
                                language={language}
                                value={content}
                                automaticLayout={true}
                                options={options}
                                quickSuggestions={true}
                                snippetSuggestions={true}
                                wordBasedSuggestions={true}
                                onChange={this.onChange}
                            />

                            <button onClick={this.submitButtonClick}>
                                Testrun
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const extensionLanguageMap = {
    'py': 'python',
    'js': 'javascript',
    'css': 'css',
    'json': 'json',
};

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

/**
 * Should have this structure to map it to the component
 *
 * This is for demo.
 * @type {*[]}
 */
const demoFiles = [
    { id: 1, title: '.gitignore' },
    { id: 2, title: 'package.json' },
    {
        id: 3,
        title: 'src',
        isDirectory: true,
        expanded: true,
        children: [
            { id: 4, title: 'styles.css' },
            { id: 5, title: 'index.js' },
            { id: 6, title: 'reducers.js' },
            { id: 7, title: 'actions.js' },
            { id: 8, title: 'utils.js' },
        ],
    },
    {
        id: 9,
        title: 'build',
        isDirectory: true,
        children: [{ id: 12, title: 'react-sortable-tree.js' }],
    },
    {
        id: 10,
        title: 'public',
        isDirectory: true,
    },
    {
        id: 11,
        title: 'node_modules',
        isDirectory: true,
    },
];

const FileExplorer = ({ data, selectedFile, onChange, nodeClicked }) => (
    <SortableTree
        className="file-explorer"
        style={{ outline: 'none' }}
        treeData={data}
        onChange={onChange}
        theme={FileExplorerTheme}
        canDrag={() => false}
        canDrop={() => false}
        generateNodeProps={rowInfo => ({
            icons: rowInfo.node.isDirectory
                ? [
                    <div
                        style={{
                            borderLeft: 'solid 8px gray',
                            borderBottom: 'solid 10px gray',
                            marginRight: 10,
                            boxSizing: 'border-box',
                            width: 16,
                            height: 12,
                            filter: rowInfo.node.expanded
                                ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                                : 'none',
                            borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                        }}
                        onClick={() => nodeClicked(rowInfo.node)}
                    />,
                ]
                : [
                    <div className="file-explorer-icon"
                         onClick={() => nodeClicked(rowInfo.node)}
                    >
                        <i className={FileIcons.getClassWithColor(rowInfo.node.title)}/>
                    </div>,
                ],
            title: ({ node }) => {
                return (
                    <span
                        onClick={() => nodeClicked(node)}>
                                            {node.id === selectedFile.id ?
                                                <i>
                                                    {node.title}
                                                </i>
                                                :
                                                (node.title)
                                            }
                                        </span>
                );
            },
        })}
    />
);

export default CodeExercise;