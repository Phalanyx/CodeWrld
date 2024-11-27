import React, { useState, useEffect } from 'react';

interface CodeTemplate {
    id: number;
    title: string;
    createdBy: { userName: string };
    forkedFromID: number;
}

interface TemplateSelectorProps {
    originalTemplates: CodeTemplate[];
    onTemplatesChange: (templates: CodeTemplate[]) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    originalTemplates,
    onTemplatesChange
}) => {
    
    const pageSize = 5;
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
    const [selectedTemplates, setSelectedTemplates] = useState<CodeTemplate[]>(originalTemplates);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetchCodeTemplates();
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        onTemplatesChange(selectedTemplates);
    }, [selectedTemplates]);

    const fetchCodeTemplates = async () => {
        const query = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            title: searchQuery,
        }).toString();

        const response = await fetch(`/api/CodeTemplates?${query}`);

        if (!response.ok) {
            console.error('Failed to fetch code templates');
            return;
        }

        const data = await response.json();

        setCodeTemplates(data.codeTemplates);
        setTotalPages(data.totalPages);
    };

    const toggleTemplate = (template: CodeTemplate) => {
        if (selectedTemplates.some((t) => t.id === template.id)) {
            setSelectedTemplates(selectedTemplates.filter((t) => t.id !== template.id));
        } else {
            setSelectedTemplates([...selectedTemplates, template]);
        }
    };

    return (
        <div className="mt-4">
            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded px-2 py-1 outline-none focus:ring focus:border"
            />

            <div className="rounded p-2 max-h-[40vh] mt-2 overflow-y-auto">
                {codeTemplates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => toggleTemplate(template)}
                        className={`p-2 rounded mb-2 cursor-pointer border ${
                            selectedTemplates.some((t) => t.id === template.id)
                                ? '!border-blue-500'
                                : 'border-gray-500'
                        }`}>
                        <h3 className="font-semibold">{template.title}</h3>
                        {template.forkedFromID && <p className="text-xs">(Forked Template)</p>}
                        <p className="text-xs">Created by: {template.createdBy.userName}</p>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4 text-sm p-1">
                    <button
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 rounded"
                        disabled={page === 1}>
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 rounded"
                        disabled={page === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelector;