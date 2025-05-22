import { NextRequest, NextResponse } from 'next/server';
import SuiAgentModule from '@0xkamal7/sui-agent';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Model configuration
const MODEL_NAME = process.env.NEXT_PUBLIC_MODEL_NAME || "Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic";
const ATOMA_API_KEY = process.env.NEXT_PUBLIC_ATOMA_API_KEY || "";

// Initialize agent instances cache
const agentInstances = new Map<string, any>();

// Special handling for ping requests - avoid calling the actual agent
const handlePingRequest = (senderAddress: string) => {
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
      return result;
    } else {
      console.warn('Agent returned non-array result:', result);
      return [{
        status: 'success',
        message: 'Query processed but resulted in unexpected format',
        query: query,
        result: result
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

export async function POST(request: NextRequest) {
  try {
    const { privateKeyBech32, query } = await request.json();
    
    if (!privateKeyBech32) {
      return NextResponse.json(
        { error: 'Missing privateKeyBech32 in request body' },
        { status: 400 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query in request body' },
        { status: 400 }
      );
    }
    
    // Get or create agent instance
    let agentData = agentInstances.get(privateKeyBech32);
    let senderAddress = '';
    let agent;
    
    if (!agentData) {
      // Decode the Bech32 private key
      try {
        const { secretKey } = decodeSuiPrivateKey(privateKeyBech32);
        const privateKeyHex = Buffer.from(secretKey).toString('hex');
        
        // Create a keypair and get the address
        const keypair = Ed25519Keypair.fromSecretKey(secretKey);
        senderAddress = keypair.getPublicKey().toSuiAddress();
        
        // Initialize the agent
        agent = new SuiAgentModule(ATOMA_API_KEY, MODEL_NAME, privateKeyHex);
        
        console.log('Agent initialized successfully');
        
        // Cache the agent instance
        agentInstances.set(privateKeyBech32, { agent, senderAddress });
      } catch (error) {
        console.error('Error initializing SUI Agent:', error);
        return NextResponse.json(
          { error: 'Failed to initialize SUI Agent with provided private key' },
          { status: 400 }
        );
      }
    } else {
      agent = agentData.agent;
      senderAddress = agentData.senderAddress;
    }
    
    // Special handling for ping requests
    if (query === 'ping') {
      return NextResponse.json(handlePingRequest(senderAddress));
    }
    
    // Process the query with error handling
    const result = await safelyProcessResponse(agent, query, senderAddress);
    
    return NextResponse.json({
      result,
      address: senderAddress
    });
  } catch (error) {
    console.error('Error processing SUI Agent request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 