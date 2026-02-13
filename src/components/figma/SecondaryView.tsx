import React from 'react';

/**
 * Secondary View Component (Slackbot)
 * Note: This is a simplified version based on screenshots.
 * Full code generation was blocked due to asset overwriting restrictions in Figma settings.
 * 
 * This component shows the Slackbot interface with:
 * - Header with Slackbot branding
 * - Messages/History tabs
 * - Welcome message with avatar
 * - Composer input
 */

export default function SecondaryView() {
  return (
    <div 
      className="bg-white h-full w-[353px] flex flex-col border-l border-gray-200" 
      data-name="Secondary view" 
      data-node-id="803:59809"
    >
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="font-black text-lg">Slackbot</h2>
          </div>
          <div className="flex gap-2">
            <button className="hover:bg-gray-100 p-2 rounded">
              <span>✎</span>
            </button>
            <button className="hover:bg-gray-100 p-2 rounded">
              <span>🔍</span>
            </button>
            <button className="hover:bg-gray-100 p-2 rounded">
              <span>⋮</span>
            </button>
            <button className="hover:bg-gray-100 p-2 rounded">
              <span>×</span>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4">
          <button className="px-3 py-2 border-b-2 border-black font-bold text-sm">
            <span className="mr-1">●</span>
            Messages
          </button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm">
            <span className="mr-1">⟲</span>
            History
          </button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm ml-auto">
            +
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 mb-6 rounded-2xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-green-400 to-pink-400 flex items-center justify-center">
            <span className="text-4xl">😊</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div>
          <h3 className="text-xl font-bold mb-2">Good morning, Arcadio!</h3>
          <p className="text-gray-600 text-sm">
            The lights different now, but the channels haven't noticed
          </p>
        </div>
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-gray-200">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="px-3 py-2">
            <input
              type="text"
              placeholder="Create a canvas summarizing my day"
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200">
            <div className="flex gap-1">
              <button className="hover:bg-gray-100 p-1 rounded">+</button>
              <button className="hover:bg-gray-100 p-1 rounded">Aa</button>
              <button className="hover:bg-gray-100 p-1 rounded">😊</button>
              <button className="hover:bg-gray-100 p-1 rounded">@</button>
              <button className="hover:bg-gray-100 p-1 rounded">...</button>
            </div>
            <div className="flex gap-1">
              <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                ▶
              </button>
              <button className="hover:bg-gray-100 p-1 rounded text-sm">▼</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
