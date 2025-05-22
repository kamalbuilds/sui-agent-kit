"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SplineScene } from './ui/splite';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { WalletConnect } from './ui/wallet-connect';
import suiAgentService from '@/lib/sui-agent';

// The URL from the Spline community
const ROBOT_SCENE_URL = 'https://app.spline.design/community/file/dcd20c6d-22e2-46c3-a22a-43c4165e61bb';

// Types for our chat messages
interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  transactionData?: any;
}

export function RobotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your SUI assistant. Connect your wallet to get started.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
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
    if (!inputValue.trim() || isLoading) return;

    // Check if wallet is connected
    if (!isConnected) {
      setMessages((prev) => [
        ...prev,
        {
          content: "Please connect your wallet first to use the SUI Agent.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process the query using the SUI Agent service
      const result = await suiAgentService.processQuery(inputValue);
      
      // Format the agent's response
      let responseContent = "I've processed your request.";
      let transactionData = null;
      
      if (result && Array.isArray(result) && result.length > 0) {
        const firstResult = result[0];
        
        // Check if we have a valid result object
        if (typeof firstResult === 'object') {
          if (firstResult.status === 'success') {
            // Handle success responses
            responseContent = firstResult.message || firstResult.response || 'Transaction completed successfully.';
            transactionData = firstResult;
          } else if (firstResult.status === 'error') {
            // Handle error responses
            responseContent = `I encountered an issue: ${firstResult.message || firstResult.error || 'Unable to complete the request.'}`;
          } else {
            // Handle other responses
            responseContent = firstResult.response || firstResult.message || JSON.stringify(firstResult);
          }
        } else {
          // Fallback for unexpected result formats
          responseContent = `Received response: ${JSON.stringify(result)}`;
        }
      }
      
      // Add bot response with transaction data if available
      const botMessage: Message = {
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        transactionData: transactionData
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message with SUI Agent:', error);
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred while processing your request'}`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle key press (for pressing Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    
    // Add wallet connected message
    setMessages((prev) => [
      ...prev,
      {
        content: `Wallet connected! Your address: ${address}. You can now send me instructions for SUI transactions.`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  // Render transaction data details if available
  const renderTransactionDetails = (transactionData: any) => {
    if (!transactionData) return null;
    
    return (
      <div className="mt-2 p-2 bg-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
        <div>Transaction Type: {transactionData.type || 'N/A'}</div>
        {transactionData.digest && (
          <div>Transaction ID: {transactionData.digest}</div>
        )}
        {transactionData.amount && (
          <div>Amount: {transactionData.amount}</div>
        )}
        {transactionData.recipient && (
          <div>Recipient: {transactionData.recipient}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row h-full">
        {/* 3D Robot Animation */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-slate-900 rounded-lg">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          <div className="absolute top-4 right-4 z-10">
            {!isConnected ? (
              <WalletConnect onConnect={handleWalletConnect} />
            ) : (
              <div className="bg-black/50 p-2 rounded-md text-sm text-white">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Connected: {walletAddress.substring(0, 8)}...
              </div>
            )}
          </div>
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
                {message.transactionData && renderTransactionDetails(message.transactionData)}
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
                placeholder={isConnected ? "Ask about SUI transactions..." : "Connect wallet first..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || !isConnected}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading || !isConnected}>
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 