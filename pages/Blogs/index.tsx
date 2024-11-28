import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackgroundGradient from '../components/BackgroundGradient';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  tags: { name: string }[];
  codeTemplates: { id: number; title: string }[];
  rating: number;
  createdBy: { id: number, userName: string, avatar: string };
}

const BlogPostsList = () => {

  const router = useRouter();
  const pageSize = 5;

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [order, setOrder] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [searchContent, setSearchContent] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchTemplates, setSearchTemplates] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState('');
  const [tagsPlaceHolder, setPlaceholder] = useState('Add tags (press Enter)');
  const [templatesInput, setTemplatesInput] = useState('');
  const [templatesPlaceHolder, setTemplatesPlaceholder] = useState('Add templates (press Enter)');

  useEffect(() => {
    if (router.isReady) {
      const { page, createdUser, title, description, content, tags, codeTemplates, order } = router.query;

      setPage(Number(page) || 1);
      setSearchUser((createdUser as string) || '');
      setSearchTitle((title as string) || '');
      setSearchDescription((description as string) || '');
      setSearchContent((content as string) || '');
      setSearchTags((tags as string)?.split(',') || []);
      setSearchTemplates((codeTemplates as string)?.split(',') || []);
      setOrder((order as string) || '');
    }
  }, [router.isReady]);

  useEffect(() => {

    const handler = setTimeout(() => {
      const currentQuery = {
        page: String(page),
        pageSize: String(pageSize), 
        createdUser: searchUser,
        title: searchTitle,
        description: searchDescription,
        content: searchContent,
        tags: searchTags.join(','),
        codeTemplates: searchTemplates.join(','),
        order: order,
      };
  
      const urlQuery = router.asPath.split('?')[1] || '';
      const newQuery = new URLSearchParams(currentQuery).toString();
  
      if (urlQuery !== newQuery) {
        router.push({
          pathname: router.pathname,
          query: currentQuery,
        }, undefined, { shallow: true });
      }
  
      fetchPosts();
      setPage(1);
    }, 500); 
  
    return () => clearTimeout(handler);
  }, [searchUser, searchTitle, searchDescription, searchContent, searchTags, searchTemplates, order]);
  
  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      order: order,
      description: searchDescription,
      content: searchContent,
      createdUser: searchUser,
      title: searchTitle,
      tags: searchTags.join(','),
      codeTemplates: searchTemplates.join(','),
    }).toString();

    const response = await fetch(`/api/BlogPosts?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      }
    });

    if (!response.ok) {
      console.error('Error fetching blog posts');
      setBlogPosts([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    setBlogPosts(data.posts);
    setTotalPages(data.totalPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>, type: 'tag' | 'template') => {
    if (e.key === 'Enter' && (type === 'tag' ? tagInput.trim() : templatesInput.trim())) {
      e.preventDefault();
      if (type === 'tag') {
        if (!searchTags.includes(tagInput.trim())) {
          setSearchTags([...searchTags, tagInput.trim()]);
        }
        setTagInput('');
      } else {
        if (!searchTemplates.includes(templatesInput.trim())) {
          setSearchTemplates([...searchTemplates, templatesInput.trim()]);
        }
        setTemplatesInput('');
      }
    }
  };

  const handleRemoveTag = (item: string, type: 'tag' | 'template') => {
    if (type === 'tag') {
      setSearchTags(searchTags.filter((t) => t !== item));
    } else {
      setSearchTemplates(searchTemplates.filter((t) => t !== item));
    }
  };

  return (
    <div className="container mx-auto p-4 mb-4">

      <h1 className="text-2xl font-bold mb-4 ">All Blog Posts</h1>

      <BackgroundGradient className="px-2 py-4 rounded-2xl bg-cta-background" color="gray">
      <div className="mb-4 flex flex-wrap bg-cta-background gap-2 items-center justify-center">
        <select 
          value={order} 
          onChange={(e) => setOrder(e.target.value)} 
          className="border p-2 pr-8 rounded outline-none"
          id="searchInput">
          <option value="">Most Recent</option>
          <option value="desc">Most Valued</option>
          <option value="asc">Most Controversial</option>
        </select>

        <input 
          type="text"   
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by description" 
          value={searchDescription} 
          onChange={(e) => setSearchDescription(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by content" 
          value={searchContent} 
          onChange={(e) => setSearchContent(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
          id="searchInput"
        />

        <input 
          type="text" 
          placeholder="Search by user" 
          value={searchUser} 
          onChange={(e) => setSearchUser(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/6 outline-none"
          id="searchInput"
        />

        <div className="flex items-center w-full md:w-3/4 lg:w-1/3 rounded h-10 p-1" id="tagSearch">
          {searchTags.filter((tag) => tag.trim() !== '').map((tag) => (
            <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={tag}>
              {tag}
                <button
                  onClick={() => {
                    handleRemoveTag(tag, 'tag');
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
            onKeyDown={(e) => handleAddTag(e, 'tag')}
            className="border-none outline-none flex-grow h-full p-2"
          />
        </div>

        <div className="flex items-center w-full md:w-3/4 lg:w-1/3 rounded h-10 p-1" id="tagSearch">
          {searchTemplates.filter((template) => template.trim() !== '').map((template) => (
            <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={template}>
              {template}
              <button
                onClick={() => {
                  handleRemoveTag(template, 'template');
                  if (searchTemplates.length === 1) {
                    setTemplatesPlaceholder('Add templates (press Enter)');
                  }
                }}
                className="ml-1 font-bold bg-transparent text-gray-500">
                &times;
              </button>
            </span>
          ))}

          <input
            type="text"
            placeholder={templatesPlaceHolder}
            value={templatesInput}
            onChange={(e) => { setTemplatesInput(e.target.value); setTemplatesPlaceholder(''); }}
            onKeyDown={(e) => handleAddTag(e, 'template')}
            className="border-none outline-none flex-grow h-full p-2"
          />
        </div>

        <button
          onClick={() => {
            setOrder('');
            setSearchUser('');
            setSearchTitle('');
            setSearchDescription('');
            setSearchContent('');
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
        {blogPosts.map((post) => (

            <div 
            className="p-4 border-gray-500 hover:cursor-pointer" key={post.id} 
            onClick={() => router.push(`Blogs/detailedView?id=${post.id}`)}
            >
            <BackgroundGradient className="p-4 rounded-2xl bg-cta-background" color={post.rating >= 0 ? "green" : "red"}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{post.title}</h2>

              <div className="flex items-center space-x-2 border rounded-full p-2">
              <img
                src={`data:image/jpeg;base64,${post.createdBy.avatar}`}
                alt=""
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
                <span className="font-semibold font-mono text-sm">{post.createdBy.userName}</span>
            </div>
            </div>

            <p className="my-2">{post.description}</p>

            <div className="my-2 rounded-lg">
              <p className="font-bold">⭐ Rating: {post.rating}</p>
            </div>

            {post.tags && post.tags.length !== 0 && (
              <div className="flex space-x-2 mt-4">
              {post.tags.map((tag) => (
                <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                {tag.name}
                </span>
              ))}
              </div>
            )}

            {post.codeTemplates && post.codeTemplates.length > 0 && (
              <div className="flex space-x-2 mt-4">
              {post.codeTemplates.map((template) => (
                <span
                key={template.id}
                className="px-2 py-1 rounded cursor-pointer"
                id="template"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/Templates/detailedView?id=${template.id}`);
                }}>
                {template.title}
                </span>
              ))}
              </div>
            )}

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
}

export default BlogPostsList;