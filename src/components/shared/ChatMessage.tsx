"use client";

import React from 'react';
import Link from 'next/link';
import { generateInitialsAvatar, createAvatarErrorHandler } from '@/lib/avatar-utils';

interface ChatMessageProps {
  message: {
    id: string;
    name: string;
    avatar: string;
    time: string;
    tag?: string;
    text?: string;
    workflow?: {
      source: string;
      data: Record<string, React.ReactNode>;
    };
    reactions?: Array<{ emoji: string; count: number }>;
    replies?: {
      count: number;
      avatars: string[];
      lastTime: string;
    };
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [avatarError, setAvatarError] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(message.avatar);

  const handleAvatarError = () => {
    if (!avatarError) {
      setAvatarError(true);
      setAvatarSrc(generateInitialsAvatar(message.name, 36));
    }
  };

  return (
    <div className="flex gap-3 hover:bg-[#f8f8f8] p-2 -mx-2 rounded transition-colors group">
      <img 
        src={avatarSrc} 
        className="w-9 h-9 rounded object-cover flex-shrink-0 mt-0.5" 
        alt={message.name}
        onError={handleAvatarError}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-bold text-[15px] text-gray-900">{message.name}</span>
          {message.tag && <span className="bg-gray-200 text-gray-700 text-[10px] px-1 rounded font-bold">{message.tag}</span>}
          <span className="text-[12px] text-gray-500 hover:underline cursor-pointer">{message.time}</span>
        </div>
        
        {/* Standard Text */}
        {message.text && (
          <div className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap">
            {message.text.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
              const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
              if (linkMatch) {
                return (
                  <Link key={i} href={linkMatch[2]} className="text-blue-600 hover:underline">
                    {linkMatch[1]}
                  </Link>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        )}
        
        {/* Workflow Block */}
        {message.workflow && (
          <div className="mt-2 text-[14px] text-gray-800 border-l-4 border-gray-300 pl-3">
            <div className="italic mb-1">
              Redirected from{' '}
              <Link href={message.workflow.source} className="text-blue-600 cursor-pointer hover:underline">
                {message.workflow.source}
              </Link>
            </div>
            {Object.entries(message.workflow.data).map(([key, val]) => (
              <div key={key} className="mb-0.5">
                <span className="font-bold">{key}:</span> {val}
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {message.reactions.map((r, i) => (
              <button 
                key={i} 
                type="button" 
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full px-2 py-0.5 text-[12px] font-medium transition-colors"
              >
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}

        {/* Thread Replies */}
        {message.replies && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-1">
              {message.replies.avatars.map((av, i) => {
                const [replyAvatarError, setReplyAvatarError] = React.useState(false);
                const handleReplyAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  if (!replyAvatarError) {
                    setReplyAvatarError(true);
                    const target = e.target as HTMLImageElement;
                    target.src = generateInitialsAvatar(`User ${i + 1}`, 24);
                  }
                };
                return (
                  <img 
                    key={i} 
                    src={av} 
                    className="w-6 h-6 rounded border-2 border-white relative z-10" 
                    alt="" 
                    onError={handleReplyAvatarError}
                  />
                );
              })}
            </div>
            <span className="text-[13px] text-blue-600 font-bold hover:underline cursor-pointer">
              {message.replies.count} replies
            </span>
            <span className="text-[12px] text-gray-500">Last reply {message.replies.lastTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};
