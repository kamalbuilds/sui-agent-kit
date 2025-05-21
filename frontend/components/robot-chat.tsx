"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SplineScene } from './ui/splite';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

// The URL from the Spline community
const ROBOT_SCENE_URL = 'https://app.spline.design/community/file/dcd20c6d-22e2-46c3-a22a-43c4165e61bb';

// Types for our chat messages
interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function RobotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your SUI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate a response
    setTimeout(() => {
      // Add bot response
      const botMessage: Message = {
        content: getBotResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Function to handle key press (for pressing Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Simple response generator (replace with real AI/backend call)
  const getBotResponse = (message: string): string => {
    const cleanMessage = message.toLowerCase();
    
    if (cleanMessage.includes('hello') || cleanMessage.includes('hi')) {
      return 'Hello there! How can I assist you with SUI?';
    }
    
    if (cleanMessage.includes('help')) {
      return 'I can help you with SUI transactions, blockchain information, or answer questions about the SUI ecosystem.';
    }
    
    if (cleanMessage.includes('transaction') || cleanMessage.includes('send')) {
      return 'To send a transaction, you need to specify the recipient address and amount. Would you like a walkthrough?';
    }
    
    return 'I\'m still learning about that. Can you ask me something about SUI transactions or the SUI blockchain?';
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row h-full">
        {/* 3D Robot Animation */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-slate-900 rounded-lg">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Chat Interface */}
        <Card className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
          <CardContent className="flex-grow overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted mr-auto'
                } max-w-[80%]`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="my-2 p-3 rounded-lg bg-muted mr-auto max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </CardContent>

          <CardFooter className="border-t p-4">
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 