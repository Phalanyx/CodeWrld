import React, { useState } from 'react';

interface TagSelectorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, setTags }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Add tags..."
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        className="w-full border rounded px-2 py-1 outline-none focus:ring focus:border"
      />

        <div className="flex space-x-2 mt-2 p-1">
        {tags && tags.map((tag) => (
          <span className="px-2 py-1 rounded" id="tag" key={tag}>
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 font-bold bg-transparent text-gray-500">
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;