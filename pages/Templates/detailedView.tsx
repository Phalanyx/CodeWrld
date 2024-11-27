import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/lib/AppVars';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import BackgroundGradient from '../components/BackgroundGradient';
import TagSelector from '../components/TagSelector';

interface CodeTemplate {
  id: number;
  title: string;
  code: string;
  explanation: string;
  language: string;
  tags: { name: string }[];
  createdBy: { userName: string; id: number, avatar: string };
  forkedFromID: number;
}

const DetailedTemplateView = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  const { id } = router.query;
  const [template, setTemplate] = useState<CodeTemplate>();
  const [originalTemplate, setOriginalTemplate] = useState<CodeTemplate>();
  const [editable, setEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedExplanation, setUpdatedExplanation] = useState('');
  const [updatedTags, setUpdatedTags] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchOriginal = async () => {
      if (template?.forkedFromID) {
        const original = await fetchOriginalTemplate(template.forkedFromID);
        setOriginalTemplate(original);
      }
    };
    fetchOriginal();

    if (template && String(context?.userID) === String(template?.createdBy.id)) {
      setEditable(true);
      setUpdatedTitle(template.title || '');
      setUpdatedExplanation(template.explanation || '');
      setUpdatedTags(template.tags.map(tag => tag.name) || []);
    }
  }, [template]);

  const fetchTemplateDetails = async () => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching template details');
      return;
    }

    const data = await response.json();

    setTemplate(data);
  };

  const fetchOriginalTemplate = async (id: number) => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching original template');
      return null;
    }

    const data = await response.json();
    return data;
  };

  const deleteTemplate = async () => {

    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      toast.error('Error deleting code');
      return;
    }

    toast.success('Code deleted successfully!');

    setTimeout(() => {
      router.push('/');
    }, 500);

  }

  const saveChanges = async () => {
    const updatedTemplate = {
      title: updatedTitle,
      explanation: updatedExplanation,
      tags: updatedTags
    };

    if (!updatedTemplate.title || !updatedTemplate.explanation) {
      toast.warning('Title and explanation are required');
      return;
    }

    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updatedTemplate),
    });

    if (!response.ok) {
      toast.error('Error updating template');
      return;
    }
    
    fetchTemplateDetails(); 
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!template) {
    return;
  }

  return (
    <div className="container mx-auto p-4 mb-4">

      <BackgroundGradient className="p-4 rounded-2xl bg-cta-background">

        <div className="flex justify-between">
          {isEditing ? (
            <input
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
            />
          ) : (
            <h2 className="text-xl font-semibold">{template.title}</h2>
          )}
          {!isEditing &&
            <div className="flex items-center space-x-2 border rounded-full p-2">
            <img
              src={`data:image/jpeg;base64,${template.createdBy.avatar}`}
              alt=""
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <span className="font-semibold font-mono text-md">{template.createdBy.userName}</span>
          </div>
    }
        </div>

        {originalTemplate && (
          <div className="mt-2">
            <p>
              [ Forked From:
              <span className="font-semibold"> {originalTemplate.title} </span>
              by <span className="font-semibold"> {originalTemplate.createdBy.userName} </span>
              ]
            </p>
          </div>
        )}

        <Editor
          height="25vh"
          language={template.language}
          value={template.code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
            fontSize: 14,
          }}
          theme={context?.theme === 'light' ? 'vs-light' : 'vs-dark'}
          className="my-4 border border-accent rounded"
        />

        <p>Language: <span className="font-bold">{template.language}</span></p>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={updatedExplanation}
              onChange={(e) => setUpdatedExplanation(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={5}
            />
          ) : (
            <p>{template.explanation}</p>
          )}
        </div>
        
        {isEditing ? (
          <TagSelector tags={updatedTags} setTags={setUpdatedTags}></TagSelector>
        ) : (
          template.tags && template.tags.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {template.tags.map((tag: { name: string }, index: number) => (
                <span key={index} className="px-2 py-1 rounded" id="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )
        )}

        {editable && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={isEditing ? saveChanges : toggleEditMode}
              className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
              {isEditing ? 'Save Changes' : 'Edit Template'}
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this template?')) {
                  deleteTemplate();
                } 
                else {
                  toast.info('Deletion cancelled!');
                }
              }}
              className="bg-transparent text-red-500 border-2 border-red-500 font-bold py-2 px-4 rounded">
              <i className="fas fa-trash"></i>
            </button>
          </div>
        )}

        {editable && isEditing && <p className="mt-2">Click on the "View Code" button below to edit code and language.</p>}

        <div className="flex justify-between mt-6 mb-1">
          <button
            onClick={() => router.push(`/Runner?id=${template.id}`)}
            className="text-button-text py-2 px-4 rounded">
            View Code (Edit & Fork)
          </button>

          {template.forkedFromID && (
            <button
              onClick={() => {
                setEditable(false);
                setOriginalTemplate(undefined);
                router.push(`/Templates/detailedView?id=${template.forkedFromID}`);
              }}
              className="bg-gray-400 text-button-text py-2 px-4 rounded">
              View Original Template
            </button>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default DetailedTemplateView;