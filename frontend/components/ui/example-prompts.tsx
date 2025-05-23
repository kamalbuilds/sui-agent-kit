"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { getAllDemoQueries, DemoQuery } from '@/lib/demo-queries';
import { Star, TrendingUp, Shield, Zap, Building, Users } from 'lucide-react';

interface ExamplePromptsProps {
  onPromptSelect: (query: string) => void;
  isConnected: boolean;
  onClose?: () => void;
}

// Simple badge component inline
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const getCategoryIcon = (category: string) => {
  if (category.toLowerCase().includes('yield')) return <TrendingUp className="h-4 w-4" />;
  if (category.toLowerCase().includes('lending')) return <Shield className="h-4 w-4" />;
  if (category.toLowerCase().includes('trading')) return <Zap className="h-4 w-4" />;
  if (category.toLowerCase().includes('institutional')) return <Building className="h-4 w-4" />;
  if (category.toLowerCase().includes('social')) return <Users className="h-4 w-4" />;
  return <Star className="h-4 w-4" />;
};

const getCategoryColor = (category: string) => {
  if (category.toLowerCase().includes('yield')) return 'bg-green-100 text-green-800 border-green-200';
  if (category.toLowerCase().includes('lending')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (category.toLowerCase().includes('trading')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (category.toLowerCase().includes('institutional')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (category.toLowerCase().includes('social')) return 'bg-pink-100 text-pink-800 border-pink-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export function ExamplePrompts({ onPromptSelect, isConnected, onClose }: ExamplePromptsProps) {
  const demoQueries = getAllDemoQueries();

  const handlePromptClick = (query: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first to try the demo queries.');
      return;
    }
    onPromptSelect(query);
    onClose?.(); // Close modal after selection
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-white">
          🚀 Try These Amazing DeFi Strategies
        </h2>
        <p className="text-gray-600">
          Click any example below to see the SUI AI Agent in action with realistic DeFi scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {demoQueries.map((demo: DemoQuery) => (
          <Card 
            key={demo.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-300"
            onClick={() => handlePromptClick(demo.query)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(demo.category)}
                  <CardTitle className="text-sm font-semibold">
                    Strategy {demo.id}
                  </CardTitle>
                </div>
                <Badge className={`text-xs ${getCategoryColor(demo.category)}`}>
                  {demo.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="mb-3">
                <p className="text-sm text-gray-700 leading-relaxed" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {demo.query.length > 120 
                    ? `${demo.query.substring(0, 120)}...` 
                    : demo.query
                  }
                </p>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Protocols:</div>
                <div className="flex flex-wrap gap-1">
                  {demo.protocols.slice(0, 3).map((protocol, index) => (
                    <Badge 
                      key={index} 
                      className="text-xs bg-gray-100 text-gray-700 border-gray-200"
                    >
                      {protocol}
                    </Badge>
                  ))}
                  {demo.protocols.length > 3 && (
                    <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                      +{demo.protocols.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>⚡ {demo.aiResponse.executionTime}</span>
                <span>⛽ {demo.aiResponse.gasUsed}</span>
              </div>

              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                disabled={!isConnected}
              >
                {isConnected ? 'Try This Strategy' : 'Connect Wallet First'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 