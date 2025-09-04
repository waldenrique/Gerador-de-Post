
import React, { useState } from 'react';
import { GeneratedPost } from '../types';
import { Icon } from './Icon';

interface PostCardProps {
  post: GeneratedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${post.title}\n\n${post.description}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <img className="w-full h-80 object-cover" src={post.imageUrl} alt="Generated for post" />
      <div className="p-6">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
              title="Copiar título e descrição"
            >
              <Icon name="copy" className="h-4 w-4" />
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{post.description}</p>
      </div>
    </div>
  );
};
