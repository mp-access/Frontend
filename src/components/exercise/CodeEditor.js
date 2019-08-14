import MonacoEditor from 'react-monaco-editor';
import React from 'react';

const CodeEditor = ({ content, language, options, onChange, isDark }) => (
    <>
        <MonacoEditor
            language={language}
            value={content}
            options={options}
            onChange={onChange}
            theme={isDark ? "vs-dark" : "vs-light"}
        />
    </>
);

export default CodeEditor;