"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SplineScene } from './ui/splite';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { WalletConnect } from './ui/wallet-connect';
import suiAgentService, { SuiAgentResponse } from '@/lib/sui-agent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Mic, MicOff, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { ExamplePrompts } from './ui/example-prompts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/modal';

// The URL from the Spline community
const ROBOT_SCENE_URL = 'https://app.spline.design/community/file/dcd20c6d-22e2-46c3-a22a-43c4165e61bb';

// Types for our chat messages
interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  transactionData?: SuiAgentResponse | null;
  status?: 'success' | 'error' | 'pending';
  responseObject?: any;
  isStreaming?: boolean;
  isDemoQuery?: boolean;
  originalContent?: string;
}

// Component for streaming message display with realistic delays
const StreamingMessage = ({ 
  content, 
  onComplete, 
  messageId, 
  transactionData, 
  responseObject 
}: { 
  content: string; 
  onComplete?: () => void; 
  messageId?: string;
  transactionData?: SuiAgentResponse | null;
  responseObject?: any;
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [isInitialDelay, setIsInitialDelay] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Reset state when content changes (new message)
  useEffect(() => {
    setDisplayedContent('');
    setCurrentIndex(0);
    setIsProcessingStep(false);
    setIsInitialDelay(true);
    setIsCompleted(false);
    setShowTransactionDetails(false);
  }, [content, messageId]);

  useEffect(() => {
    // Add 5-second initial delay before streaming starts
    if (isInitialDelay) {
      const initialTimer = setTimeout(() => {
        setIsInitialDelay(false);
      }, 2000); // 5 seconds delay for better UX

      return () => clearTimeout(initialTimer);
    }

    if (!isInitialDelay && currentIndex < content.length) {
      const currentChar = content[currentIndex];
      let delay = 25; // Slightly slower default typing speed
      
      // Add longer delays for realistic transaction processing
      if (content.substring(currentIndex).startsWith('Step ')) {
        delay = 3000; // 3 second delay before each step
        setIsProcessingStep(true);
      } else if (content.substring(currentIndex).startsWith('• Transaction:')) {
        delay = 1200; // Longer delay before showing transaction hash
      } else if (currentChar === '\n' && content[currentIndex + 1] === '\n') {
        delay = 800; // Longer pause between sections
      } else if (currentChar === '✅') {
        delay = 500; // Longer pause after success checkmark
        setIsProcessingStep(false);
      } else if (content.substring(currentIndex).startsWith('📊') || content.substring(currentIndex).startsWith('🎯')) {
        delay = 2000; // Delay before summary sections
      }

      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + currentChar);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (!isInitialDelay && currentIndex >= content.length && !isCompleted) {
      // Streaming completed, show success badge and transaction details after a short delay
      const completionTimer = setTimeout(() => {
        setIsCompleted(true);
        setIsProcessingStep(false);
        setShowTransactionDetails(true); // Show transaction details after streaming completes
        if (onComplete) {
          onComplete();
        }
      }, 1000); // 1 second delay before showing success badge and details

      return () => clearTimeout(completionTimer);
    }
  }, [currentIndex, content, onComplete, isInitialDelay, messageId, isCompleted]);

  // Format the content with better spacing between steps
  const formatContent = (text: string) => {
    return text
      .split('\n\n') // Split into sections
      .map((section, index) => {
        const trimmedSection = section.trim();
        
        if (trimmedSection.startsWith('💰') || trimmedSection.startsWith('🚀')) {
          return (
            <div key={index} className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <div className="font-bold text-blue-900 text-lg flex items-center gap-2">
                {trimmedSection}
              </div>
            </div>
          );
        }
        
        if (trimmedSection.startsWith('Step ')) {
          const lines = trimmedSection.split('\n');
          const stepTitle = lines[0];
          const stepContent = lines.slice(1);
          
          return (
            <div key={index} className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 shadow-sm">
              <div className="font-bold text-green-900 text-base mb-4 flex items-center gap-2">
                {stepTitle}
                {isProcessingStep && currentIndex < content.length && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Executing...</span>
                  </div>
                )}
              </div>
              <div className="text-green-800 space-y-3">
                {stepContent.map((line, lineIndex) => {
                  if (line.startsWith('• Transaction:')) {
                    return (
                      <div key={lineIndex} className="ml-2 p-3 bg-green-100 rounded-md font-mono text-sm border border-green-200">
                        <span className="text-green-600">🔗 Transaction: </span>
                        <span className="text-green-800 font-semibold break-all">{line.replace('• Transaction: ', '')}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={lineIndex} className="ml-2 text-green-700 leading-relaxed">{line}</div>
                  );
                })}
              </div>
            </div>
          );
        }

        if (trimmedSection.startsWith('📊') || trimmedSection.startsWith('🎯')) {
          return (
            <div key={index} className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500 shadow-sm">
              <div className="font-bold text-purple-900 text-base mb-4">{trimmedSection.split('\n')[0]}</div>
              <div className="text-purple-800 space-y-2">
                {trimmedSection.split('\n').slice(1).map((line, lineIndex) => (
                  <div key={lineIndex} className="ml-2 leading-relaxed">{line}</div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-gray-800">
              {trimmedSection.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="leading-relaxed">{line}</div>
              ))}
            </div>
          </div>
        );
      });
  };

  // Helper function to render transaction details for demo queries
  const renderDemoTransactionDetails = () => {
    if (!transactionData || transactionData.type !== 'demo_query' || !showTransactionDetails) return null;

    return (
      <div className="mt-4 p-3 bg-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
        <div className="mb-2 p-2 bg-blue-900/30 rounded border border-blue-700">
          <div className="text-blue-300 font-medium mb-1">🎯 Response:</div>
          {transactionData.transactionHashes && transactionData.transactionHashes.length > 0 && (
            <div className="mt-2">
              <div className="text-slate-400 mb-1">Transaction Hashes:</div>
              {transactionData.transactionHashes.map((hash: string, index: number) => (
                <div key={index} className="font-mono text-xs text-green-300 truncate">
                  {hash}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isInitialDelay ? (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Processing your request...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {formatContent(displayedContent)}
          {isCompleted && (
            <div className="flex items-center space-x-2 text-green-600 mt-4">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Transaction completed successfully!</span>
            </div>
          )}
        </div>
      )}
      {renderDemoTransactionDetails()}
    </div>
  );
};

export function RobotChat() {
  // Add mounted state to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize component after mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    // Set initial message after mounting
    setMessages([
      {
        content: "Hello! I'm your SUI assistant. Connect your wallet to get started.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMounted) {
      scrollToBottom();
    }
  }, [messages, isMounted]);

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
          status: 'error'
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
      const results = await suiAgentService.processQuery(inputValue);

      if (!results || results.length === 0) {
        // Handle empty results
        addBotMessage("I didn't receive any response from the agent. Please try again.", 'error');
        return;
      }

      // Process each result and add to chat
      results.forEach((result, index) => {
        // Check if this is a demo query response
        const isDemoQuery = result.type === 'demo_query';
        
        // Handle response format - could be string or object
        let responseContent = '';
        let responseObject = null;

        // Check if response is an object or a string
        if (result.response && typeof result.response === 'object') {
          // If it's an object, stringify it for display and keep original for data display
          responseObject = result.response;
          responseContent = formatResponseObject(result.response);
        } else if (result.response && typeof result.response === 'string') {
          // Check if response is a JSON string
          try {
            const parsedResponse = JSON.parse(result.response);
            responseObject = parsedResponse;
            responseContent = formatResponseObject(parsedResponse);
          } catch (e) {
            // Not a JSON string, use as is
            responseContent = result.response || result.message || "I've processed your request.";
          }
        } else {
          // Fallback to message field
          responseContent = result.message || "I've processed your request.";
        }

        // Add a separator for multiple responses
        if (results.length > 1 && index > 0) {
          responseContent = `Additional info: ${responseContent}`;
        }

        // Add the bot message with transaction data and response object
        addBotMessage(responseContent, result.status, result, responseObject, isDemoQuery);
      });
    } catch (error) {
      console.error('Error processing message with SUI Agent:', error);
      addBotMessage(
        `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred while processing your request'}`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format an object response for display
  const formatResponseObject = (obj: any): string => {
    if (!obj) return '';

    // Handle price response objects
    if (obj.price !== undefined) {
      if (obj.coin) {
        return `The current price of ${obj.coin} is $${obj.price.toFixed(2)}`;
      }
      return `Price: $${obj.price.toFixed(2)}`;
    }

    // Handle multiple coin prices in an object
    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
      const entries = Object.entries(obj);
      if (entries.every(([_, value]) => typeof value === 'number')) {
        // Likely a price object with multiple coins
        return entries
          .map(([coin, price]) => {
            const priceValue = price as number;
            if (priceValue < 0) {
              return `${coin}: Price not available`;
            }
            return `${coin}: $${priceValue.toFixed(2)}`;
          })
          .join('\n');
      }
    }

    // Default to JSON stringification for other objects
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return 'Object data available (see details)';
    }
  };

  // Helper function to add bot messages
  const addBotMessage = (
    content: string,
    status: 'success' | 'error' | 'pending' = 'success',
    transactionData?: SuiAgentResponse,
    responseObject?: any,
    isDemoQuery?: boolean
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        content: isDemoQuery ? '' : content, // Start with empty content for demo queries
        isUser: false,
        timestamp: new Date(),
        transactionData: transactionData || null,
        status,
        responseObject,
        isDemoQuery,
        originalContent: isDemoQuery ? content : undefined // Store original content for streaming
      },
    ]);

    // Convert bot message to speech only for non-demo queries (demo queries handle this in onComplete)
    if (status === 'success' && !isDemoQuery && isMounted) {
      convertTextToSpeech(content);
    }
  };

  // Function to handle key press (for pressing Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to format wallet address
  const formatAddress = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);

    // Add a welcome message
    setMessages((prev) => [
      ...prev,
      {
        content: `Wallet connected successfully! Address: ${formatAddress(address)}. You can now ask me about SUI transactions, prices, and more.`,
        isUser: false,
        timestamp: new Date(),
        status: 'success'
      },
    ]);
  };

  // Function to format time for recording
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to start recording
  const startRecording = async () => {
    if (!isMounted || typeof window === 'undefined') return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        convertSpeechToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Function to convert speech to text
  const convertSpeechToText = async (audioBlob: Blob) => {
    if (!isMounted) return;
    
    setIsProcessingSpeech(true);
    try {
      // This is a placeholder for speech-to-text conversion
      // In a real implementation, you would send the audioBlob to a speech-to-text service
      // For now, we'll just show a message
      setInputValue("Speech recognition not implemented yet. Please type your message.");
    } catch (error) {
      console.error('Error converting speech to text:', error);
    } finally {
      setIsProcessingSpeech(false);
    }
  };

  // Function to convert text to speech
  const convertTextToSpeech = async (text: string) => {
    if (!isMounted || !isAudioEnabled || typeof window === 'undefined') return;

    try {
      // Check if speech synthesis is available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.7;
        
        // Get available voices and use a preferred one if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  // Function to toggle audio
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Function to handle prompt selection
  const handlePromptSelect = (query: string) => {
    setInputValue(query);
    
    // Auto-send the selected prompt after a short delay
    setTimeout(() => {
      if (query.trim() && isConnected) {
        setInputValue(query);
        // Trigger send message
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        handleKeyPress(event as any);
      }
    }, 100);
  };

  // Function to render transaction details
  const renderTransactionDetails = (message: Message) => {
    if (!message.transactionData || message.isDemoQuery) return null;

    const { transactionData } = message;
    
    return (
      <div className="mt-4 p-3 bg-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
        <div className="mb-2 p-2 bg-blue-900/30 rounded border border-blue-700">
          <div className="text-blue-300 font-medium mb-1">🎯 Response:</div>
          <div className="text-slate-300">{transactionData.message}</div>
          {transactionData.transactionHashes && transactionData.transactionHashes.length > 0 && (
            <div className="mt-2">
              <div className="text-slate-400 mb-1">Transaction Hashes:</div>
              {transactionData.transactionHashes.map((hash: string, index: number) => (
                <div key={index} className="font-mono text-xs text-green-300 truncate">
                  {hash}
                </div>
              ))}
            </div>
          )}
        </div>

        {message.responseObject && (
          <div className="mt-2 p-2 bg-purple-900/30 rounded border border-purple-700">
            <div className="text-purple-300 font-medium mb-1">📊 Data:</div>
            <div className="max-h-32 overflow-y-auto">
              {renderObjectDetails(message.responseObject)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper to render object details recursively
  const renderObjectDetails = (obj: any, level = 0): React.ReactNode => {
    if (obj === null || obj === undefined) return <div>None</div>;

    if (typeof obj !== 'object') {
      return <div>{String(obj)}</div>;
    }

    if (Array.isArray(obj)) {
      return (
        <div className="pl-2 border-l border-slate-700">
          {obj.map((item, index) => (
            <div key={index} className="mb-1">
              <span className="text-slate-400">[{index}]:</span> {
                typeof item === 'object' ? (
                  renderObjectDetails(item, level + 1)
                ) : (
                  String(item)
                )
              }
            </div>
          ))}
        </div>
      );
    }

    // Object case
    return (
      <div className={level > 0 ? "pl-2 border-l border-slate-700" : ""}>
        {Object.entries(obj).map(([key, value], index) => (
          <div key={key} className="mb-1">
            <span className="text-slate-400">{key}:</span> {
              typeof value === 'object' ? (
                renderObjectDetails(value, level + 1)
              ) : (
                String(value)
              )
            }
          </div>
        ))}
      </div>
    );
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen max-h-screen">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-1/2 h-64 lg:h-full relative bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-sm">Loading...</span>
            </div>
          </div>
          <Card className="w-full lg:w-1/2 h-full flex flex-col">
            <CardContent className="flex-grow overflow-y-auto p-4 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading chat...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="flex flex-col lg:flex-row h-full">
        {/* 3D Robot Animation */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full relative bg-slate-900 rounded-lg">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
            {!isConnected ? (
              <WalletConnect onConnect={handleWalletConnect} />
            ) : (
              <>
                <div className="bg-black/50 p-2 rounded-md text-sm text-white">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Connected: {formatAddress(walletAddress)}
                </div>
                <Button
                  onClick={toggleAudio}
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70"
                >
                  {isAudioEnabled ? (
                    <Volume2 className="h-4 w-4 text-white" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-white" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="w-full lg:w-1/2 h-full flex flex-col">
          <CardContent className="flex-grow overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 p-3 rounded-lg ${message.isUser
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : message.status === 'error'
                    ? 'bg-destructive/10 text-destructive mr-auto'
                    : 'bg-muted mr-auto'
                  } max-w-[85%]`}
              >
                {/* Render message content */}
                {message.isDemoQuery && !message.isUser ? (
                  <StreamingMessage 
                    content={message.originalContent || message.content}
                    onComplete={() => {
                      // Convert bot message to speech after streaming completes
                      if (message.status === 'success' && isMounted) {
                        convertTextToSpeech(message.originalContent || message.content);
                      }
                    }}
                    messageId={`demo-${index}-${message.timestamp.getTime()}`}
                    transactionData={message.transactionData}
                    responseObject={message.responseObject}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                
                {renderTransactionDetails(message)}
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
            <div className="flex w-full space-x-2 items-center">
              <Input
                placeholder={isConnected ? "Ask about SUI transactions..." : "Connect wallet first..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || !isConnected || isProcessingSpeech}
                className="flex-grow"
              />
              <div className="flex items-center space-x-2">
                {/* Examples Modal Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isConnected}
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Examples
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>Strategies</DialogTitle>
                    </DialogHeader>
                    <ExamplePrompts 
                      onPromptSelect={handlePromptSelect}
                      isConnected={isConnected}
                      onClose={() => {
                        // The dialog will close automatically when DialogTrigger state changes
                        // We can add any additional cleanup here if needed
                      }}
                    />
                  </DialogContent>
                </Dialog>

                {isRecording && (
                  <div className="text-sm text-red-500 font-mono">
                    {formatTime(recordingTime)}
                  </div>
                )}
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isConnected || isLoading || isProcessingSpeech}
                  variant="outline"
                  className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !isConnected || isProcessingSpeech}
                className="bg-primary hover:bg-primary/90"
              >
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
} 