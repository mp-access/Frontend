import MonacoEditor from 'react-monaco-editor';
import React from 'react';

const CodeEditor = ({ content, language, options, onChange, height }) => (
    <>
        <MonacoEditor
            height={height}
            language={language}
            value={content}
            options={options}
            onChange={onChange}
        />
    </>
);

export default CodeEditor;