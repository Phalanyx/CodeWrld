import React from 'react'




interface CodeControlsProps {
    id: number;
    code: string;
    language: string;
    run: boolean;
    setRun: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeControls: React.FC<CodeControlsProps> = ({id}) => {


  const saveCode = async () => {

    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: JSON.stringify({ code: 'code', language: 'python' })
    });
    const data = await response.json();
  }
  
  const deleteCode = async () => {
    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
    });
    const data = await response.json();
    }

  const forkCode = async () => {
    const response = await fetch(`/api/CodeTemplates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ code: 'code', language: 'python' })
    });
    const data = await response.json();
    }
  return (
    <div className="flex space-x-4">

        <button className="">
            <i className="fas fa-code-branch"></i> 
        </button>

        <button className="" onClick={saveCode}>
            <i className="fas fa-save"></i> 
        </button>
        

        <button className="" onClick={deleteCode}>
            <i className="fas fa-trash-alt"></i> 
        </button>
    </div>

  )
}

export default CodeControls