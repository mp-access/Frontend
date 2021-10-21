import React, { memo } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { getClassWithColor } from 'file-icons-js';
import './FileExplorer.css';

const noOp = () => {};

const FileExplorer = ({ data, selectedFile, nodeClicked }) => (
    <>
        <div className={'row'}>
            <div className={'col'}>
                <small className="explorer-label">
                    File Explorer
                </small>
            </div>
        </div>

        <SortableTree
            className="file-explorer"
            treeData={data}
            onChange={noOp}
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
                            <span className={getClassWithColor(rowInfo.node.title)}/>
                        </div>,
                    ],
                title: ({ node }) => {
                    return (
                        <span>
                            {node.path === selectedFile.path ?
                                <strong>
                                    {node.title}{node.isDirty ? '*' : ''}
                                </strong>
                                :
                                <>
                                    {node.title}{node.isDirty ? '*' : ''}
                                </>
                            }
                        </span>
                    );
                },
            })}
        />
    </>
);

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.selectedFile.id === nextProps.selectedFile.id;
};

export default memo(FileExplorer, arePropsEqual);