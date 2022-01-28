import React, { PureComponent } from 'react';
import FileExplorer from './FileExplorer';
import UserConsole from './UserConsole';
import MediaViewer from '../MediaViewer';
import 'file-icons-js/css/style.css';
import './CodeExercise.css';
import JSZip from 'jszip';
import CourseDataService from '../../utils/CourseDataService';
import { Col, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { Download, Play } from 'react-feather';
import Spinner from '../core/Spinner';
import Util from '../../utils/Util';

class CodeExercise extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            runButtonState: false,
            fileIndex: new Map(),
            fileStructure: [],
        };
    }

    componentDidMount = async () => {
        const { exercise, workspace, authContext } = this.props;

        authContext.onLogout(() => Util.storeStateInSessionStorage(this.state));

        const exerciseState = Util.loadStateFromSessionStorage();
        if (exerciseState) {
            this.setState({
                ...exerciseState,
            });
            sessionStorage.removeItem('exerciseState');
        } else {
            const submission = workspace.submission;
            const publicFiles = (submission ? submission.publicFiles : exercise.public_files) || [];

            const questionFile = {
                nameWithExtension: 'description.md',
                path: '/description.md',
                content: exercise.question,
                extension: 'md',
                isDirectory: false,
            };

            // folders
            const pub_dir = {
                title: 'public',
                path: '/public',
                isDirectory: true,
            };
            const priv_dir = {
                title: 'private',
                path: '/private',
                isDirectory: true,
            };
            const sol_dir = {
                title: 'solution',
                path: '/solution',
                isDirectory: true,
            };
            const res_dir = {
                title: 'resource',
                path: '/resource',
                isDirectory: true,
            };

            let fileMap = new Map();

            fileMap.set('/question.md', questionFile);
            fileMap.set('/public', pub_dir);
            publicFiles.forEach(f => {
                fileMap.set('/public' + f.path.replace(/\\/g, '/'), f);
            });

            if (exercise.solution_files && exercise.solution_files.length) {
                fileMap.set('/solution', sol_dir);
                exercise.solution_files.forEach(f => {
                    fileMap.set('/solution' + f.path.replace(/\\/g, '/'), f);
                });
            }
            if (exercise.private_files && exercise.private_files.length) {
                fileMap.set('/private', priv_dir);
                exercise.private_files.forEach(f => {
                    fileMap.set('/private' + f.path.replace(/\\/g, '/'), f);
                });
            }
            if (exercise.resource_files && exercise.resource_files.length) {
                fileMap.set('/resource', res_dir);
                exercise.resource_files.forEach(f => {
                    fileMap.set('/resource' + f.path.replace(/\\/g, '/'), f);
                });
            }

            const { fileIndex, fileStructure } = this.generateFileStructures(fileMap);
            const selectedFilePath = sessionStorage.getItem('selectedFile');
            const selectedFile = fileIndex.get(selectedFilePath) || fileIndex.get('/question.md');

            this.setState({
                fileIndex,
                fileStructure,
                selectedFile,
            });
        }
    };

    getPublicFiles = () => {
        let type = 'code';
        const { selectedFile, fileIndex } = this.state;
        let publicFiles = [];
        fileIndex.forEach((val, key) => {
            if (key.startsWith('/public') && !val.isDirectory) {
                publicFiles.push({
                    ...val,
                    path: val.path.replace('/public', ''),
                    name: val.title.replace('.' + val.extension, ''),
                });
            }
        });

        // If selected file is not inside the publicFolder,
        // just take the first file in the public folder as selected file
        let selectedPublicFile = publicFiles.find(f => f.id === selectedFile.id);

        return {
            type: type,
            publicFiles: publicFiles,
            selectedFileId: selectedPublicFile ? selectedPublicFile.id : -1,
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
        const { selectedFile, fileIndex } = this.state;

        this.props.setIsDirty(true);

        const updatedSelectedFile = {
            ...selectedFile,
            content: newValue,
        };

        fileIndex.set(updatedSelectedFile.path, updatedSelectedFile);

        let structureChanged = false;

        const fileStructure = this.walkHierarchy(this.state.fileStructure, n => {
            if (n.path === selectedFile.path && !n.isDirectory && !n.isDirty) {
                structureChanged = true;
                return {
                    ...n,
                    isDirty: true,
                };
            } else {
                return n;
            }
        });

        if (structureChanged) {
            this.setState({
                selectedFile: updatedSelectedFile,
                fileIndex,
                fileStructure,
            });
        } else {
            this.setState({
                selectedFile: updatedSelectedFile,
                fileIndex,
            });
        }
    };

    walkHierarchy = (structure, action) => {
        return structure.map(n => {
            if (n.isDirectory) {
                return action({
                    ...n,
                    children: this.walkHierarchy(n.children, action),
                });
            } else {
                return action(n);
            }
        });
    };


    nodeClicked = (node) => {
        const fileStructure = this.walkHierarchy(this.state.fileStructure, n => {
            if (n.isDirectory) {
                return {
                    ...n,
                    expanded: n.path === node.path ? !n.expanded : n.expanded,
                };
            } else {
                return n;
            }
        });

        if (node.isDirectory) {
            this.setState({ fileStructure });
        } else {
            const selectedFile = this.state.fileIndex.get(node.path);
            sessionStorage.setItem('selectedFile', selectedFile.path);
            this.setState({ selectedFile, fileStructure });
        }
    };

    render() {
        const { workspace, authorizationHeader } = this.props;
        const { selectedFile, fileStructure } = this.state;
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
                            This button will <strong>run</strong>, <strong>test</strong> and <strong>save</strong> your
                            code<br/><small>(ctrl + s)</small>
                        </Tooltip>
                    }
                >
                    <span><Play size={14}/>Test & Run</span>
                </OverlayTrigger>
            </>;
        }

        const buttonCluster = (
            <Row className='align-items-center'>
                <Col><h1>{this.props.exercise.longTitle}</h1></Col>
                <Col xs='auto'><button className="style-btn ghost" onClick={this.downloadWorkspace}><Download size={14}/>Download</button></Col>
                <Col xs='auto'><button className="style-btn" disabled={this.state.runButtonState}
                             onClick={this.onCodeSubmit}>{runButtonContent}</button></Col>
            </Row>
        );

        return (
            <Stack gap='4'>
                {buttonCluster}
                <div className="row">
                    <div className="col-2 br1">
                        <small className="explorer-label">File Explorer</small>
                        <FileExplorer data={fileStructure} selectedFile={selectedFile}
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
                <div className="row">
                    <div className="col-12">
                        {userConsole}
                    </div>
                </div>
            </Stack>
        );
    }

    generateFileStructures = (flatFileMap) => {

        let fileStructure = [];
        let fileIndex = new Map();

        for (let file of flatFileMap) {
            let dirs = file[0].split('/');
            dirs.shift();

            let step = fileStructure;

            for (let i = 0; i < dirs.length; ++i) {
                let dir = '/' + dirs.slice(0, i + 1).join('/');

                if (!fileIndex.get(dir)) {
                    if (i === (dirs.length - 1) && !file[1].isDirectory) {
                        fileIndex.set(file[0], {
                            id: file[1].id,
                            title: file[1].nameWithExtension,
                            path: file[0],
                            isDirectory: false,
                            extension: file[1].extension,
                            content: file[1].content,
                            readOnly: !file[0].startsWith('/public'),
                        });

                        step.push({
                            title: file[1].nameWithExtension,
                            path: file[0],
                            isDirectory: false,
                            extension: file[1].extension,
                        });
                    } else {
                        fileIndex.set(dir, {
                            title: dirs[i],
                            path: dir,
                            isDirectory: true,
                        });
                        let folder = {
                            title: dirs[i],
                            path: dir,
                            isDirectory: true,
                            children: [],
                            expanded: dirs[i] === 'public',
                        };

                        step.push(folder);
                        step = folder.children;
                    }
                } else {
                    step = step.find(el => {
                        return el.path === dir;
                    }).children;
                }
            }
        }

        const sortfunc = (a, b) => {
            if (b.isDirectory !== a.isDirectory) {
                // a is a directory or b is a directory
                return b.isDirectory ? 1 : -1;
            } else {
                // a and b are both directories or both files
                return a.path.localeCompare(b.path);
            }
        };

        fileStructure = this.walkHierarchy(fileStructure.sort(sortfunc), n => {
            if (n.isDirectory) {
                return {
                    ...n,
                    children: n.children.sort(sortfunc),
                };
            } else {
                return n;
            }
        });


        return { fileIndex, fileStructure };
    };

    downloadWorkspace = async () => {
        const zip = new JSZip();
        const { fileIndex } = this.state;
        const { exercise, authorizationHeader } = this.props;
        const exerciseId = exercise.id;

        let zipMap = new Map();

        zipMap.set('/', zip.folder(exercise.assignmentId));

        for (let node of fileIndex) {
            const index = node[0].lastIndexOf('/');
            const parentPath = node[0].substring(0, index);
            const parent = zipMap.get(parentPath === '' ? '/' : parentPath);

            if (node[1].isDirectory) {
                const zipFolder = parent.folder(node[1].title);
                zipMap.set(node[0], zipFolder);
            } else {
                const mediaType = Util.MEDIA_TYPE_MAP[node[1].extension];
                let zipFile;
                if (mediaType === 'code') {
                    zipFile = parent.file(node[1].title, node[1].content);
                } else {
                    const content = await CourseDataService.getExerciseFile(exerciseId, node[1].id, authorizationHeader);
                    zipFile = parent.file(node[1].title, content);
                }
                zipMap.set(node[0], zipFile);
            }
        }

        zip.generateAsync({ type: 'base64' }).then(function(content) {
            window.location.href = 'data:application/zip;base64,' + content;
        });
    };
}


export default CodeExercise;

