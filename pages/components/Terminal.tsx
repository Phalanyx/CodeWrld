import React, { useContext, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react';
import { AppContext } from '@/lib/AppVars';

interface TerminalProps {
  lang: string;
  code?: string;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
}


const Terminal: React.FC<TerminalProps> = ({ lang, code, setCode}) => {


  const context = useContext(AppContext);

  const theme = context?.theme;
  
  const editorRef = useRef(null);


  function onMount(editor: any) {
    editorRef.current = editor;    
  }

  
  return (
    <div>
        <Editor
        height='80vh'
        width = '50vw'  
        language={lang}
        defaultValue='#Type your code here'
        defaultLanguage='python'
        value={code}
        onMount={onMount}
        onChange={
          (value) => {
            setTimeout(() => {
              if (setCode) {
                setCode(value ?? '');
              }
            }, 0);
          }
        }
        theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
        options= {{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on'
        }}
        />
    </div>
  )
}

export default Terminal