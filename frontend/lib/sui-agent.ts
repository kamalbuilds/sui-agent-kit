// Client-side service to interact with the SUI Agent API
class SuiAgentService {
  private privateKey: string | null = null;
  private senderAddress: string = '';
  
  constructor() {
    // Agent will be initialized on demand via API
  }

  /**
   * Initialize the Sui Agent with the provided private key
   * @param privateKeyBech32 The Bech32 encoded private key (starting with "suiprivkey")
   * @returns The derived Sui address
   */
  async initializeAgent(privateKeyBech32: string): Promise<string> {
    try {
      // Store the private key for future API calls
      this.privateKey = privateKeyBech32;
      
      // Make a test call to the API to verify the private key
      const response = await fetch('/api/sui-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privateKeyBech32,
          query: 'ping', // Simple query to test connection
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize SUI Agent');
      }
      
      const data = await response.json();
      this.senderAddress = data.address;
      
      return this.senderAddress;
    } catch (error) {
      console.error('Error initializing Sui Agent:', error);
      throw new Error('Failed to initialize Sui Agent');
    }
  }

  /**
   * Process a user query using the Sui Agent
   * @param query The user's query text
   * @returns The result of processing the query
   */
  async processQuery(query: string): Promise<any> {
    if (!this.privateKey) {
      throw new Error('Sui Agent not initialized. Please provide a private key.');
    }
    
    try {
      const response = await fetch('/api/sui-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privateKeyBech32: this.privateKey,
          query,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process query');
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }

  /**
   * Check if the agent is initialized
   * @returns Boolean indicating if the agent is ready
   */
  isInitialized(): boolean {
    return !!this.privateKey && !!this.senderAddress;
  }

  /**
   * Get the current sender address
   * @returns The Sui address
   */
  getSenderAddress(): string {
    return this.senderAddress;
  }
}

// Create and export a singleton instance
const suiAgentService = new SuiAgentService();
export default suiAgentService; 