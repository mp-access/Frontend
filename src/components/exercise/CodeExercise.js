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
            //fileExplorerData: undefined,
            runButtonState: false,
            fileMap: new Map()
        };
    }

    componentDidMount = async () => {
        const { exercise, workspace } = this.props;
        const {fileMap} = this.state;
        const submission = workspace.submission;
        const publicFiles = (submission ? submission.publicFiles : exercise.public_files) || [];

        const questionFile = {
            id: 'description.md',
            name: 'description',
            title: 'description.md',
            path: '\\description.md',
            content: exercise.question,
            extension: 'md',
            readOnly: true,
        };

        // folders
        const pub_dir = {
            id: 'public',
            title: 'public',
            path: '\\public',
            isDirectory: true,
            expanded: true,
            children: [],
        };
        const priv_dir = {
            id: 'private',
            title: 'private',
            path: '\\private',
            isDirectory: true,
            children: [],
        };
        const sol_dir = {
            id: 'solution',
            title: 'solution',
            path: '\\solution',
            isDirectory: true,
            children: [],
        };
        const res_dir = {
            id: 'resource',
            title: 'resource',
            path: '\\resource',
            isDirectory: true,
            children: [],
        };

        fileMap.set('question.md', questionFile);
        
        
        
        
        
        pub_dir.children = mapVirtualFilesToTreeStructure(publicFiles);
        fileMap.set('public', pub_dir);

//        let files = [questionFile]
//            .concat(pub_dir);

        if (exercise.solution_files) {
            sol_dir.children = mapVirtualFilesToTreeStructure(exercise.solution_files);
//            files = files.concat(sol_dir);
            fileMap.set('solution', sol_dir);
            
        }
        if (exercise.private_files) {
            priv_dir.children = mapVirtualFilesToTreeStructure(exercise.private_files);
//            files = files.concat(priv_dir);
            fileMap.set('private', priv_dir);
        }
        if (exercise.resource_files && exercise.resource_files.length) {
            res_dir.children = mapVirtualFilesToTreeStructure(exercise.resource_files);
//            files = files.concat(res_dir);
            fileMap.set('resource', res_dir);
        }

//        const fileExplorerData = files;

        const selectedFilePath = sessionStorage.getItem('selectedFile');
        const selectedFile = this.findByPath(fileMap, selectedFilePath);

        this.setState({
//            fileExplorerData,
            selectedFile: !!selectedFile ? selectedFile : questionFile,
            fileMap
        });

        console.log(fileMap);
        console.log(buildfileStructure(fileMap));
    };

    getPublicFiles = () => {
        let type = 'code';
        const { selectedFile, fileMap } = this.state;
        const { children: publicFiles } = fileMap
            .find(folder => folder.id === 'public_files') || { children: [] };

        // If selected file is not inside the publicFolder,
        // just take the first file in the public folder as selected file
        let selectedFileIndex = publicFiles.findIndex(f => f.id === selectedFile.id);
        if (selectedFileIndex < 0) {
            selectedFileIndex = 0;
        }

        sessionStorage.setItem('selectedFile', selectedFile.path);
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
        //this.setState({ fileExplorerData: data });
        console.log(data);
    };
    

    nodeClicked = (node) => {
        console.log(node);

        let newFileMap = {...this.state.fileMap};
        let selectedFile = this.findByPath(newFileMap, node.path);

        

        /*
        const fileMap = this.state.fileMap.map(n => {
            if (n.path === node.path && n.isDirectory) {
                return {
                    ...n,
                    expanded: !n.expanded,
                };
            } else if (n.path === node.path) {
                return {
                    ...n,
                    active: true,
                };
            }
            return n;
        });
        */

        if (node.isDirectory) {
            selectedFile.expanded = !selectedFile.expanded;

            this.setState({ fileMap: newFileMap });
        } else {
//            const selectedFile = this.searchInFiles(fileExplorerData, node.id);
            //const selectedFile = this.findByPath(newFileMap, node.path);
            selectedFile.active = true;

            this.setState({ selectedFile, fileMap: newFileMap });
        }

        console.log(newFileMap);
    };

    /*
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
    */

    findByPath(map, filePath){
        if(map === null || filePath === null) return undefined;
        let parts = filePath.split("\\");
        parts.shift();
        
        let tmpDir = map;
        for(let part of parts){
            let tmp = tmpDir.get(part);
            if(tmp !== undefined) tmpDir = tmp.children;
            else return undefined;
        }
        return tmpDir;
    }

    render() {
        const { workspace, authorizationHeader } = this.props;
        const { selectedFile, fileMap } = this.state;
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
                        <FileExplorer data={buildfileStructure(fileMap)} selectedFile={selectedFile}
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
    
    let map = new Map();

    for(let file of virtualFiles){
        var dirs = file.path.split('\\');
        dirs.shift();

        let tmp = map;
        
        for(let i = 0; i < dirs.length-1; ++i){
            if(tmp.get(dirs[i]) === undefined){
                
                tmp.set(dirs[i], {
                    id: dirs[i],
                    title: dirs[i],
                    path: "\\" + dirs.slice(0,i+1).join("\\"),
                    isDirectory: true,
                    children: new Map(),
                });
            }

            tmp = tmp.get(dirs[i]).children;
        }

        tmp.set(dirs[dirs.length-1], {...file, title: `${file.name}.${file.extension}`});
        
    }

    return map;
};

const buildfileStructure = (map) => {
    let arr = [];

    for(let item of map){
        if(item[1].isDirectory){
            arr.push({
                path: item[1].path,
                title: item[1].title,
                isDirectory: true,
                children: buildfileStructure(item[1].children),
            })
        }else{
            arr.push({
                path: item[1].path,
                title: item[1].title,
                isDirectory: false,
                extension: item[1].extension,
            })
        }
    }

    return arr;
}


export default CodeExercise;
