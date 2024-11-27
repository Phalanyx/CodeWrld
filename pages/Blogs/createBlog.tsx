import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import TagSelector from '../components/TagSelector';
import TemplateSelector from '../components/TemplateSelector';
import BackgroundGradient from '../components/BackgroundGradient';

interface CodeTemplate {
    id: number;
    title: string;
    createdBy: { userName: string };
    forkedFromID: number;
}

const BlogCreator = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [tags, setTags] = useState<string[]>([]);
    const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !content) {
            toast.warning('Title, description, and content cannot be empty!');
            return;
        }

        const response = await fetch('/api/BlogPosts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                title,
                description,
                content,
                tags,
                codeTemplates: codeTemplates.map((template) => template.id),
            }),
        });

        if (!response.ok) {
            toast.error('Error updating post!');
            return;
        }

        const newBlog = await response.json();

        toast.success('Blog created successfully!');
        setTimeout(() => {
            router.push(`/Blogs/detailedView?id=${newBlog.id}`);
        }, 500);
    };

    return (
        <div className="container mx-auto p-4 mb-4">
            <BackgroundGradient className="border rounded-2xl p-4 bg-cta-background">
                <h1 className="text-xl font-bold">Create New Blog Post</h1>

                <label className="block font-medium mt-4 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-2 py-1 outline-none focus:ring focus:border"
                />

                <label className="block font-medium mt-4 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 border rounded px-2 py-1 outline-none focus:ring focus:border"
                />

                <label className="block font-medium mt-4 mb-2">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[25vh] border rounded px-2 py-1 outline-none focus:ring focus:border"
                />

                <label className="block font-medium mt-4">Tags</label>

                <TagSelector tags={tags} setTags={setTags} />

                <label className="block font-medium mt-4">Code Templates</label>

                <TemplateSelector originalTemplates={codeTemplates} onTemplatesChange={setCodeTemplates} />

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCreateBlog}
                        className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
                        Create Blog
                    </button>
                </div>
            </BackgroundGradient>
        </div>
    );
};

export default BlogCreator;