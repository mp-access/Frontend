import MonacoEditor from 'react-monaco-editor';
import React from 'react';

const CodeEditor = ({ content, language, options, onChange, isDark, submitCode }) => (
    <>
        <MonacoEditor
            language={language}
            value={content}
            options={options}
            onChange={onChange}
            theme={isDark ? 'vs-dark' : 'vs-light'}
            editorDidMount={(editor, monaco) => onMount(editor, monaco, submitCode)}
        />
    </>
);

const onMount = (editor, monaco, codeSubmit) => {
    const testAndRunBindings = [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B,
        monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_B,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_S,
    ];

    testAndRunBindings.forEach(binding => editor.addCommand(binding, () => codeSubmit()));
};

export default CodeEditor;