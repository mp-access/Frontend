import MonacoEditor from 'react-monaco-editor';
import React from 'react';
import Util from '../../utils/Util';

const CodeEditor = ({ content, language, options, onChange, submitCode }) => {
    const isDark = Util.getIsDarkFromLocalStorage();
    return (
        <>
            <MonacoEditor
                language={language}
                value={content}
                options={options}
                onChange={onChange}
                theme={setTheme(isDark)}
                editorDidMount={(editor, monaco) => onMount(editor, monaco, submitCode)}
            />
        </>
    );
};

const onMount = (editor, monaco, submitCode) => {
    const testAndRunBindings = [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B,
        monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_B,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_S,
    ];

    const darkModeBinding = [
        monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_P,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_P,
    ];

    darkModeBinding.forEach(binding => editor.addCommand(binding, () => toggleDarkMode(monaco)));

    testAndRunBindings.forEach(binding => editor.addCommand(binding, submitCode));
};

const toggleDarkMode = (monaco) => monaco.editor.setTheme(setTheme(Util.toggleAndThenGetIsDark()));

const setTheme = (isDark) => isDark ? 'vs-dark' : 'vs-light';

export default CodeEditor;