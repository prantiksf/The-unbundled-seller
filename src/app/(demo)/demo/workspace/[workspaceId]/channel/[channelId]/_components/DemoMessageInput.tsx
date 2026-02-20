"use client";

import { useState } from "react";
import { MessageInput } from "@/components/shared/MessageInput";

interface DemoMessageInputProps {
  channelId: string;
  placeholder?: string;
}

// Mock AI responses for auto-reply
const AI_RESPONSES: Record<string, string[]> = {
  slackbot: [
    "I've updated the CRM and flagged the budget objection for your review.",
    "The deal has been moved to the next stage. I'll notify you when the contract is signed.",
    "I've analyzed the pipeline and identified 3 deals that need immediate attention.",
    "The follow-up email has been scheduled for tomorrow at 10 AM.",
  ],
  "sarah-chen": [
    "Thanks for the update! I'll review the proposal and get back to you by EOD.",
    "Got it. Let me check with the team and circle back.",
  ],
  "jordan-hayes": [
    "Perfect timing! I was just about to reach out about this.",
    "I've shared this with the product team. They'll review it this week.",
  ],
  "priya-shah": [
    "This looks great! I'll add it to our sprint planning.",
    "Thanks for flagging this. I'll prioritize it.",
  ],
};

export function DemoMessageInput({ channelId, placeholder }: DemoMessageInputProps) {
  const ph = placeholder ?? `Message #${channelId}`;
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Clear input immediately
    setInputText("");
    
    // In a real implementation, this would add the message to the chat
    // For now, we just clear the input since messages are managed by DemoDataContext
    // The auto-reply logic would be handled at a higher level if needed
    
    // Auto-reply after 1.5 seconds (if this component had access to message state)
    setTimeout(() => {
      const responses = AI_RESPONSES[channelId] || AI_RESPONSES.slackbot;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      // In a full implementation, this would add the AI message to chatMessages
      console.log("AI Reply:", randomResponse);
    }, 1500);
  };

  return (
    <MessageInput 
      placeholder={ph}
      onSubmit={handleSendMessage}
      value={inputText}
      onChange={setInputText}
    />
  );
}
