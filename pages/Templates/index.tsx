import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackgroundGradient from '../components/BackgroundGradient';

const languages = ['python', 'javascript', 'java', 'c', 'cpp', 'ruby', 'rust', 'swift', 'r', 'php', 'go'];

interface CodeTemplate {
  id: number;
  title: string;
  language: string;
  tags: { name: string }[];
  code: string;
  createdBy: { id: number, userName: string, avatar: string };
  forkedFromID: number; 
}

const CodeTemplatesList = () => {
  const router = useRouter();
  const pageSize = 5;
  
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchUser, setSearchUser] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [searchExplanation, setSearchExplanation] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState('');
  const [tagsPlaceHolder, setPlaceholder] = useState('Add tags (press Enter)');

  useEffect(() => {
    if (router.isReady) {
      const { page, createdUser, title, language, explanation, code, tags } = router.query;

      setPage(Number(page) || 1);
      setSearchUser((createdUser as string) || '');
      setSearchTitle((title as string) || '');
      setSearchLanguage((language as string) || '');
      setSearchExplanation((explanation as string) || '');
      setSearchCode((code as string) || '');
      setSearchTags((tags as string)?.split(',') || []);
    }
  }, [router.isReady]);

  useEffect(() => {
    
    const handler = setTimeout(() => {
      const currentQuery = {
        page: String(page),
        createdUser: searchUser,
        title: searchTitle,
        language: searchLanguage,
        code: searchCode,
        explanation: searchExplanation,
        tags: searchTags.join(','),
      };
  
      const urlQuery = router.asPath.split('?')[1] || '';
      const newQuery = new URLSearchParams(currentQuery).toString();
  
      if (urlQuery !== newQuery) {
        router.push({
          pathname: router.pathname,
          query: currentQuery,
        }, undefined, { shallow: true });
      }
  
      fetchTemplates();
      setPage(1);
    }, 500); 
  
    return () => clearTimeout(handler);
  }, [searchUser, searchTitle, searchLanguage, searchExplanation, searchCode, searchTags]);  

  useEffect(() => {
    fetchTemplates();
  }, [page]);

  const fetchTemplates = async () => {
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      createdUser: searchUser,
      title: searchTitle,
      language: searchLanguage,
      code: searchCode,
      explanation: searchExplanation,
      tags: searchTags.join(','),
    }).toString();

    const response = await fetch(`/api/CodeTemplates?${query}`);

    if (!response.ok) {
      console.error('Error fetching templates');
      setTemplates([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    setTemplates(data.codeTemplates);
    setTotalPages(data.totalPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSearchTags(searchTags.filter((t) => t !== tag));
  };

  return (
    <div className="container mx-auto p-4 mb-4">
      <h1 className="text-2xl font-bold mb-4">All Code Templates</h1>

      <BackgroundGradient className="px-2 py-4 rounded-2xl bg-cta-background" color="gray">
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-center">
        <select 
          value={searchLanguage} 
          onChange={(e) => setSearchLanguage(e.target.value)} 
          className="border p-2 rounded pr-8 outline-none h-10"
          id="searchInput">
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <input 
          type="text"   
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none h-10" 
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by explanation" 
          value={searchExplanation} 
          onChange={(e) => setSearchExplanation(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none h-10" 
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by code" 
          value={searchCode} 
          onChange={(e) => setSearchCode(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none h-10"
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by user" 
          value={searchUser} 
          onChange={(e) => setSearchUser(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/6 outline-none h-10"
          id="searchInput"
        />

        <div className="flex items-center w-full md:w-1/2 lg:w-1/2 rounded h-10 p-1" id="tagSearch">
          {searchTags.filter(tag => tag.trim() !== '').map((tag) => (
            <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={tag}> 
              {tag}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                  if (searchTags.length === 1) {
                    setPlaceholder('Add tags (press Enter)');
                  }
                }}
                className="ml-1 font-bold bg-transparent text-gray-500">
                &times;
              </button>
            </span>
          ))}

          <input
            type="text"
            placeholder={tagsPlaceHolder}
            value={tagInput}
            onChange={(e) => { setTagInput(e.target.value); setPlaceholder(''); }}
            onKeyDown={handleAddTag}
            className="border-none outline-none flex-grow h-full p-1"
          />
        </div>

        <button
          onClick={() => {
            setSearchUser('');
            setSearchTitle('');
            setSearchLanguage('');
            setSearchExplanation('');
            setSearchTags([]);
            setTagInput('');
            setPlaceholder('Add tags (press Enter)');
          }}
          className="px-6 py-2 rounded">
          Clear
        </button>
      </div>
      </BackgroundGradient>


      <div className="mt-4 overflow-y-auto h-[60vh] border">
        {templates.map((template) => (
           <div className="p-4 hover:cursor-pointer" key={template.id}
           onClick={() => router.push(`Templates/detailedView?id=${template.id}`)}>
            
            <BackgroundGradient className="p-4 rounded-2xl bg-cta-background" color="blue">

              <div className="rounded-2xl bg-cta-background">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{template.title}</h2>

                  <div className="flex items-center space-x-2 border rounded-full p-2">
                  <img
                    src={`data:image/jpeg;base64,${template.createdBy.avatar}`}
                    alt=""
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                    <span className="font-semibold font-mono text-sm">{template.createdBy.userName}</span>
                  </div>
                </div>

                {template.forkedFromID && (
                <p>[ Forked Template ]</p>
                )}
                
                <p className="mt-2">Language: {template.language}</p>

                {template.tags && template.tags.length !== 0 && (
                  <div className="flex space-x-2 mt-4">
                    {template.tags.map((tag) => (
                      <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </BackgroundGradient>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          className="px-4 py-2 rounded"
          disabled={page === 1}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 rounded"
          disabled={page === totalPages}>
          Next
        </button>
      </div>

    </div>
  );
};

export default CodeTemplatesList;