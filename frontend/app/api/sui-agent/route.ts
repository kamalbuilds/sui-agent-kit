import { NextRequest, NextResponse } from 'next/server';
import SuiAgentModule from '@0xkamal7/sui-agent';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { findDemoQuery } from '@/lib/demo-queries';

// Model configuration
const MODEL_NAME = process.env.NEXT_PUBLIC_MODEL_NAME || "Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic";
const ATOMA_API_KEY = process.env.NEXT_PUBLIC_ATOMA_API_KEY || "";

// Initialize agent instances cache
const agentInstances = new Map<string, any>();

// Response types
interface ApiResponse {
  result: Array<{
    status: 'success' | 'error' | 'pending';
    message: string;
    response?: string | Record<string, any>;
    type?: string;
    query?: string;
    [key: string]: any;
  }>;
  address: string;
}

// Special handling for ping requests - avoid calling the actual agent
const handlePingRequest = (senderAddress: string): ApiResponse => {
  return {
    result: [
      {
        status: 'success',
        message: 'Connection successful',
        type: 'ping',
        address: senderAddress
      }
    ],
    address: senderAddress
  };
};

// Safely process the agent's response to handle any JSON parsing errors
const safelyProcessResponse = async (agent: any, query: string, senderAddress: string) => {
  try {
    // Process query using the SUI Agent
    const result = await agent.processUserQueryPipeline(query, senderAddress);
    
    // Ensure the result is a properly formatted array
    if (Array.isArray(result)) {
      // Normalize each result item to ensure it has the required fields
      return result.map(item => normalizeResponseItem(item, query));
    } else if (result && typeof result === 'object') {
      // Handle single object response
      return [normalizeResponseItem(result, query)];
    } else if (typeof result === 'string') {
      // Handle string response
      return [{
        status: 'success',
        message: result,
        query: query
      }];
    } else {
      console.warn('Agent returned unexpected format:', result);
      return [{
        status: 'success',
        message: 'Query processed but resulted in unexpected format',
        query: query,
        rawResult: result
      }];
    }
  } catch (error) {
    console.error('Error in agent processing:', error);
    return [{
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error in agent processing',
      query: query
    }];
  }
};

// Helper to normalize response items
const normalizeResponseItem = (item: any, query: string) => {
  // If it's not an object, convert to standard format
  if (!item || typeof item !== 'object') {
    return {
      status: 'success',
      message: String(item),
      query: query
    };
  }
  
  // Extract response field which may be an object or string
  let responseField = item.response;
  
  // If response is a string that looks like JSON, try to parse it
  if (responseField && typeof responseField === 'string') {
    try {
      // Only try to parse if it looks like a JSON object or array
      if ((responseField.startsWith('{') && responseField.endsWith('}')) || 
          (responseField.startsWith('[') && responseField.endsWith(']'))) {
        responseField = JSON.parse(responseField);
      }
    } catch (e) {
      // Keep as string if parsing fails
      console.warn('Failed to parse response JSON string:', e);
    }
  }
  
  // Ensure the response has the required status field
  const status = item.status || 'success';
  
  // Combine message from various possible fields
  const message = item.message || 
                 (typeof item.response === 'string' ? item.response : '') || 
                 'Operation completed';
  
  // Build the normalized response
  return {
    ...item,
    status,
    message,
    response: responseField,
    query: query
  };
};

// Handle demo query responses
const handleDemoQueryRequest = (query: string, senderAddress: string): ApiResponse => {
  const demoQuery = findDemoQuery(query);
  
  if (!demoQuery) {
    return {
      result: [{
        status: 'error',
        message: 'Demo query not found',
        query: query
      }],
      address: senderAddress
    };
  }

  // Format the demo response to match our API structure
  return {
    result: [
      {
        status: demoQuery.aiResponse.status,
        message: demoQuery.aiResponse.message,
        response: demoQuery.aiResponse.message,
        type: 'demo_query',
        query: query,
        category: demoQuery.category,
        protocols: demoQuery.protocols,
        executionTime: demoQuery.aiResponse.executionTime,
        gasUsed: demoQuery.aiResponse.gasUsed,
        transactionHashes: demoQuery.aiResponse.transactionHashes,
        demoQueryId: demoQuery.id
      }
    ],
    address: senderAddress
  };
};

export async function POST(request: NextRequest) {
  try {
    const { privateKeyBech32, query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { 
          error: 'Missing query in request body',
          result: [{
            status: 'error',
            message: 'Please provide a query to process.'
          }]
        },
        { status: 400 }
      );
    }

    // For demo queries, handle them without requiring wallet connection
    const demoQuery = findDemoQuery(query);
    if (demoQuery) {
      return NextResponse.json(handleDemoQueryRequest(query, 'demo-address'));
    }

    // For all other queries (including ping), we need a private key
    if (!privateKeyBech32) {
      return NextResponse.json(
        { 
          error: 'Missing privateKeyBech32 in request body',
          result: [{
            status: 'error',
            message: 'Missing private key. Please connect your wallet.'
          }]
        },
        { status: 400 }
      );
    }
    
    // Get or create agent instance and derive the real wallet address
    let agentData = agentInstances.get(privateKeyBech32);
    let senderAddress = '';
    let agent;
    
    if (!agentData) {
      // Decode the Bech32 private key and derive the real address
      try {
        const { secretKey } = decodeSuiPrivateKey(privateKeyBech32);
        const privateKeyHex = Buffer.from(secretKey).toString('hex');
        
        // Create a keypair and get the REAL address
        const keypair = Ed25519Keypair.fromSecretKey(secretKey);
        senderAddress = keypair.getPublicKey().toSuiAddress();
        
        // Initialize the agent with the real private key
        agent = new SuiAgentModule(ATOMA_API_KEY, MODEL_NAME, privateKeyHex);
        
        console.log('Agent initialized successfully for address:', senderAddress);
        
        // Cache the agent instance with the real address
        agentInstances.set(privateKeyBech32, { agent, senderAddress });
      } catch (error) {
        console.error('Error initializing SUI Agent:', error);
        return NextResponse.json(
          { 
            error: 'Failed to initialize SUI Agent with provided private key',
            result: [{
              status: 'error',
              message: error instanceof Error ? 
                `Failed to initialize SUI Agent: ${error.message}` : 
                'Failed to initialize SUI Agent with provided private key'
            }]
          },
          { status: 400 }
        );
      }
    } else {
      // Use cached agent and real address
      agent = agentData.agent;
      senderAddress = agentData.senderAddress;
    }
    
    // Handle ping requests with the REAL wallet address
    if (query === 'ping') {
      return NextResponse.json(handlePingRequest(senderAddress));
    }
    
    // Process the query with error handling using the real agent and address
    const result = await safelyProcessResponse(agent, query, senderAddress);
    
    // Return response with the REAL wallet address
    return NextResponse.json({
      result,
      address: senderAddress
    });
  } catch (error) {
    console.error('Error processing SUI Agent request:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process request',
        result: [{
          status: 'error',
          message: error instanceof Error ? 
            `Server error: ${error.message}` : 
            'An unknown error occurred while processing your request'
        }]
      },
      { status: 500 }
    );
  }
} 