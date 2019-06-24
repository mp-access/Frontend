import MonacoEditor from 'react-monaco-editor';
import React from 'react';

const CodeEditor = ({ content, language, options, onChange, onRun }) => (
    <>
        <MonacoEditor
            height="600px"
            language={language}
            value={content}
            options={options}
            onChange={onChange}
        />
        <button onClick={onRun}>
            Testrun
        </button>
    </>
);

export default CodeEditor;