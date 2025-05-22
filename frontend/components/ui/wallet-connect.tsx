import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import suiAgentService from '@/lib/sui-agent';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [privateKey, setPrivateKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async () => {
    if (!privateKey.trim()) {
      setError('Please enter a valid private key');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      // Initialize agent with the provided private key
      const address = await suiAgentService.initializeAgent(privateKey);
      
      // Call the onConnect callback with the derived address
      onConnect(address);
      
      // Close the dialog
      setIsOpen(false);
      
      // Clear the private key from state
      setPrivateKey('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error 
        ? err.message 
        : 'Invalid private key format. Please use a valid Sui private key.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your Sui Wallet</DialogTitle>
          <DialogDescription>
            Enter your Sui private key to connect your wallet.
            Your key is only stored in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="private-key"
              placeholder="suiprivkey..."
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting} 
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 