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
}

// Component for streaming message display with realistic delays
const StreamingMessage = ({ content, onComplete }: { content: string; onComplete?: () => void }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [isInitialDelay, setIsInitialDelay] = useState(true);

  useEffect(() => {
    // Add 15-second initial delay before streaming starts
    if (isInitialDelay) {
      const initialTimer = setTimeout(() => {
        setIsInitialDelay(false);
      }, 15000); // 15 seconds delay

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
    } else if (!isInitialDelay && onComplete) {
      setIsProcessingStep(false);
      onComplete();
    }
  }, [currentIndex, content, onComplete, isInitialDelay]);

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

  return (
    <div className="space-y-2">
      {isInitialDelay ? (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          </div>
          <span className="text-blue-700 font-medium">
            🤖 AI Agent is analyzing your request and preparing the strategy...
          </span>
        </div>
      ) : (
        <>
          {formatContent(displayedContent)}
          {currentIndex < content.length && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-yellow-700 text-sm font-medium">
                {isProcessingStep ? '⚡ Executing blockchain transaction...' : '📝 Processing strategy details...'}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        content,
        isUser: false,
        timestamp: new Date(),
        transactionData: transactionData || null,
        status,
        responseObject,
        isDemoQuery
      },
    ]);

    // Convert bot message to speech only for non-demo queries (demo queries handle this in onComplete)
    if (status === 'success' && !isDemoQuery) {
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

    // Add wallet connected message
    addBotMessage(
      `Wallet connected! Your address: ${formatAddress(address)}. You can now send me instructions for SUI transactions.`,
      'success'
    );
  };

  // Function to format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await convertSpeechToText(audioBlob);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      addBotMessage('Error accessing microphone. Please check your permissions.', 'error');
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Function to convert speech to text using ElevenLabs API
  const convertSpeechToText = async (audioBlob: Blob) => {
    setIsProcessingSpeech(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model_id', 'scribe_v1'); // Using whisper-1 as the default model

      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert speech to text');
      }

      const data = await response.json();
      console.log("Converted text data >>>>", data);

      setInputValue(data.text || '');
    } catch (error) {
      console.error('Error converting speech to text:', error);
      addBotMessage('Error converting speech to text. Please try again.', 'error');
    } finally {
      setIsProcessingSpeech(false);
    }
  };

  // Add text to speech function
  const convertTextToSpeech = async (text: string) => {
    if (!isAudioEnabled) return;

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  // Add audio toggle function
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Handle prompt selection from example prompts
  const handlePromptSelect = (query: string) => {
    setInputValue(query);
    // Optionally auto-send the message
    // handleSendMessage();
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Add cleanup for audio URL
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  // Render transaction details for messages
  const renderTransactionDetails = (message: Message) => {
    const { transactionData, responseObject } = message;
    
    if (!transactionData && !responseObject) return null;

    return (
      <div className="mt-2 p-3 bg-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
        {/* Render transaction data if available */}
        {transactionData && (
          <div className="mb-2">
            {transactionData.status === 'success' ? (
              <div className="flex items-center text-green-400 mb-1">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Success
              </div>
            ) : transactionData.status === 'error' ? (
              <div className="flex items-center text-red-400 mb-1">
                <AlertCircle className="w-4 h-4 mr-1" /> Error
              </div>
            ) : null}

            {/* Demo query specific information */}
            {transactionData.type === 'demo_query' && (
              <div className="mb-2 p-2 bg-blue-900/30 rounded border border-blue-700">
                <div className="text-blue-300 font-medium mb-1">🎯 Demo Query Response</div>
                {transactionData.category && (
                  <div className="mb-1">Category: <span className="text-blue-200">{transactionData.category}</span></div>
                )}
                {transactionData.protocols && (
                  <div className="mb-1">
                    Protocols: <span className="text-blue-200">{transactionData.protocols.join(', ')}</span>
                  </div>
                )}
                {transactionData.executionTime && (
                  <div className="mb-1">⚡ Execution Time: <span className="text-green-300">{transactionData.executionTime}</span></div>
                )}
                {transactionData.gasUsed && (
                  <div className="mb-1">⛽ Gas Used: <span className="text-yellow-300">{transactionData.gasUsed}</span></div>
                )}
                {transactionData.transactionHashes && transactionData.transactionHashes.length > 0 && (
                  <div className="mt-2">
                    <div className="text-slate-400 mb-1">Transaction Hashes:</div>
                    {transactionData.transactionHashes.map((hash: string, index: number) => (
                      <div key={index} className="font-mono text-xs text-green-300 truncate">
                        {index + 1}. {hash}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {transactionData.type && transactionData.type !== 'demo_query' && (
              <div>Transaction Type: {transactionData.type}</div>
            )}
            {transactionData.digest && (
              <div className="truncate">Transaction ID: {transactionData.digest}</div>
            )}
            {transactionData.amount && (
              <div>Amount: {transactionData.amount}</div>
            )}
            {transactionData.recipient && (
              <div className="truncate">Recipient: {transactionData.recipient}</div>
            )}
            {transactionData.error && (
              <div className="text-red-400">Error: {transactionData.error}</div>
            )}
          </div>
        )}

        {/* Render response object if available */}
        {responseObject && (
          <div>
            <div className="text-xs font-medium mb-1 border-t border-slate-700 pt-2 mt-2">Data Details:</div>
            {renderObjectDetails(responseObject)}
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
                    content={message.content}
                    onComplete={() => {
                      // Convert bot message to speech after streaming completes
                      if (message.status === 'success') {
                        convertTextToSpeech(message.content);
                      }
                    }}
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
                      <DialogTitle>Demo Strategies</DialogTitle>
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