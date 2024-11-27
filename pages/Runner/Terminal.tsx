import React, { useRef, useContext } from 'react'
import Editor from '@monaco-editor/react';
import { AppContext } from '@/lib/AppVars';


interface TerminalProps {
  lang: string;
}



const Terminal: React.FC<TerminalProps> = ({ lang }) => {
  const context = useContext(AppContext);
  const editorRef = useRef(null);

  function onMount(editor: any) {
    editorRef.current = editor;    

  }
  

  return (
    <div>
        <Editor
        height='90vh'
        width = '50vw'  
        onMount={onMount}
        language={lang}
        theme={context?.theme === 'light' ? 'vs-light' : 'vs-dark'}
        />
    </div>
  )
}

export default Terminal