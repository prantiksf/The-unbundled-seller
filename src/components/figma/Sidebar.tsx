import React from 'react';

/**
 * Sidebar Component
 * Note: This is a simplified version based on screenshots.
 * Full code generation was blocked due to asset overwriting restrictions in Figma settings.
 * 
 * The sidebar includes:
 * - Workspace header (Acme Inc)
 * - Navigation items (Unreads, Threads, Drafts & sent)
 * - Channels section (q3-priorities, support, sales-support)
 * - Direct messages section (Lee Hao, Lisa Dawson, Slackbot, Claude, Sales Agent)
 * - Apps section (Polly, Jira Plus, Google Drive, Google Calendar)
 */

export default function Sidebar() {
  return (
    <div 
      className="bg-[#611f69] h-full w-[230px] flex flex-col text-white" 
      data-name="Sidebar" 
      data-node-id="803:59757"
    >
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-lg">Acme Inc</h2>
          <div className="flex gap-2">
            <button className="hover:bg-[rgba(255,255,255,0.1)] p-1 rounded">
              <span>☰</span>
            </button>
            <button className="hover:bg-[rgba(255,255,255,0.1)] p-1 rounded">
              <span>✎</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Pages Section */}
        <div className="px-2 mb-4">
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">📥</span>
            <span>Unreads</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">💬</span>
            <span>Threads</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">▶</span>
              <span>Drafts & sent</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span>✏ 3</span>
              <span>👁 1</span>
            </div>
          </div>
        </div>

        {/* Channels Section */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 py-1 text-sm">
            <div className="flex items-center">
              <span className="mr-2">▼</span>
              <span>Channels</span>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">#</span>
            <span>q3-priorities</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">#</span>
            <span>support</span>
          </div>
          <div className="flex items-center px-2 py-1 bg-[rgba(255,255,255,0.2)] rounded cursor-pointer">
            <span className="mr-2">#</span>
            <span>sales-support</span>
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 py-1 text-sm">
            <div className="flex items-center">
              <span className="mr-2">▼</span>
              <span>Direct messages</span>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">👤</span>
            <span>Lee Hao, Lisa Dawson</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">🤖</span>
            <span>Slackbot</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">🎨</span>
            <span>Claude</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">📊</span>
            <span>Sales Agent</span>
          </div>
        </div>

        {/* Apps Section */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 py-1 text-sm">
            <div className="flex items-center">
              <span className="mr-2">▼</span>
              <span>Apps</span>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">📊</span>
            <span>Polly</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">🔵</span>
            <span>Jira Plus</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">📁</span>
            <span>Google Drive</span>
          </div>
          <div className="flex items-center px-2 py-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span className="mr-2">📅</span>
            <span>Google Calendar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
