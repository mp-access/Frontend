import React from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import FileIcons from 'file-icons-js';


const FileExplorer = ({ data, selectedFile, onChange, nodeClicked }) => (
    <>
        <div className={'row'}>
            <div className={'col'}>
                <small className="explorer-label">
                    EXPLORER
                </small>
            </div>
        </div>
        <SortableTree
            className="file-explorer"
            treeData={data}
            onChange={onChange}
            theme={FileExplorerTheme}
            canDrag={false}
            canDrop={() => false}
            generateNodeProps={rowInfo => ({
                onClick: () => nodeClicked(rowInfo.node),
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
                        />,
                    ]
                    : [
                        <div className="file-explorer-icon">
                            <i className={FileIcons.getClassWithColor(rowInfo.node.title)}/>
                        </div>,
                    ],
                title: ({ node }) => {
                    return (
                        <span>
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
    </>
);

export default FileExplorer;