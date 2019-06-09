import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactMarkdown from 'react-markdown';
import utils from '../utils';
import 'file-icons-js/css/style.css';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import FileIcons from 'file-icons-js';
import SortableTree from 'react-sortable-tree';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            workspace: [],

            treeData: files,
            activeFile: '',
        };
    }

    componentDidMount() {
        this.setState({
            selectedFile: this.props.exercise.public_files[0],
            workspace: this.props.exercise.public_files,
        });
    }

    select(file) {
        this.setState({ selectedFile: file });
    }

    submitButtonClick = () => {
        console.log('Submit Button pressed');
        let workspace = this.state.workspace;
        const { headers } = this.props.authorizationHeader;

        fetch(utils.courseServiceUrl + '/submissions/' + this.props.exercise.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({
                'type': 'code',
                'details': {
                    'graded': 'false',
                    'publicFiles': workspace,
                },
            }),
        }).then(response => {
            if (response.status === 202) {
                console.log('202 - Submission Successful');
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        }).then(response => {
            console.debug(response);
        }).catch(error => {
            console.error(error);
        });
    };

    //update workspace if code gets edited by user
    onChange = (newValue) => {
        let workspace = this.state.workspace.slice();
        let index = workspace.indexOf(this.state.selectedFile);
        let file = workspace[index];
        file = { ...file, content: newValue };
        workspace[index] = file;
        this.setState(({ workspace, selectedFile: file }));
    };

    nodeClicked = (node, path, treeIndex) => {
        console.log(node, path, treeIndex);
        const treeData = this.state.treeData.map(n => {
            if (n.id === node.id && n.isDirectory) {
                return {
                    ...n,
                    expanded: !n.expanded,
                };
            }
            return n;
        });

        this.setState({ treeData });

        // const activeFile = this.state.exercise.public_files.find(f => f.id === node.id);
        // this.setState({ activeFile });
    };

    render() {
        if (!this.state.selectedFile) {
            return null;
        }

        const options = { selectOnLineNumbers: true };

        let files = this.state.workspace.map((f) =>
            <button key={f.id} className="btn btn-light" onClick={() => this.select(f)}>
                {f.name + '.' + f.extension}
            </button>,
        );


        const { content } = this.state.selectedFile;
        const language = extensionLanguageMap[this.state.selectedFile.extension];

        const { treeData } = this.state;

        return (
            <>
                <div className="row">
                    <div className="border border-secondary rounded">
                        <ReactMarkdown source={this.props.exercise.question}/>
                    </div>
                </div>

                <div className="row  border border-secondary rounded">
                    <div className="col-2">
                        <SortableTree
                            style={{ outline: 'none' }}
                            treeData={treeData}
                            onChange={treeData => this.setState({ treeData })}
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
                                            onClick={() => this.nodeClicked(rowInfo.node, rowInfo.path, rowInfo.treeIndex)}
                                        />,
                                    ]
                                    : [
                                        <div
                                            style={{
                                                fontSize: 8,
                                                textAlign: 'center',
                                                marginRight: 10,
                                                width: 12,
                                                height: 16,
                                            }}
                                            onClick={() => this.nodeClicked(rowInfo.node, rowInfo.path, rowInfo.treeIndex)}
                                        >
                                            <i className={FileIcons.getClassWithColor(rowInfo.node.title)}/>
                                        </div>,
                                    ],
                                title: ({ node, path, treeIndex }) => {
                                    return (
                                        <span
                                            onClick={() => this.nodeClicked(node, path, treeIndex)}> {node.title}</span>
                                    );
                                },
                            })}
                        />
                    </div>

                    <div className="col-10">
                        <div className="btn-group btn-group-sm" role="group" aria-label="files">
                            {files}
                        </div>
                        <div className="border">
                            <MonacoEditor
                                height="450px"
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
 * Should have this structure to map it to the component
 * @type {*[]}
 */
const files = [
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
        children: [{ title: 'react-sortable-tree.js' }],
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

export default CodeExercise;