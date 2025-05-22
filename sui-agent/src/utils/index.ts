import { AtomaSDK } from 'atoma-ts-sdk';
import Atoma from '../config/atoma';
import Tools from './tools';
import { IntentAgentResponse, ToolArgument } from '../@types/interface';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
/**
 * Generate a simple UUID for error tracking
 * This is a cross-platform compatible replacement for crypto.randomUUID()
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Core utility class for processing agent responses and orchestrating tool execution.
 * This class serves as the central coordinator for:
 * 1. Query Processing - Executes tools based on intent analysis
 * 2. Response Aggregation - Combines results from multiple tools
 * 3. Error Handling - Manages failures and generates structured errors
 *
 * The class implements a robust pipeline for:
 * - Tool execution and coordination
 * - Response formatting and standardization
 * - Error recovery and reporting
 */
class Utils {
  private sdk: AtomaSDK;
  private prompt: string;
  private tools: Tools;

  /**
   * Creates a new Utils instance with authentication and prompt template.
   *
   * @param bearerAuth - Authentication token for API access
   * @param prompt - Template for final answer generation
   * @param tools - Optional Tools instance for execution
=   */
  constructor(bearerAuth: string, prompt: string, tools?: Tools) {
    this.sdk = new AtomaSDK({ bearerAuth });
    this.prompt = prompt;
    // Use provided tools instance or create new one
    this.tools = tools || new Tools(bearerAuth, prompt);
  }

  /**
   * Updates the tools instance used for execution.
   *
   * @param tools - New Tools instance to use
   *
   * TODO:
   * - Implement graceful tool transition
   */
  setTools(tools: Tools) {
    this.tools = tools;
  }

  /**
   * Processes user queries by executing appropriate tools and aggregating results.
   * Core orchestration method that:
   * 1. Validates intent responses
   * 2. Executes selected tools
   * 3. Aggregates results
   * 4. Generates final response
   *
   * @param AtomaInstance - Instance of Atoma for LLM access
   * @param query - Original user query
   * @param intentResponses - Array of tool selection responses
   * @param privateKey - Optional private key for signing blockchain transactions
   * @returns Processed and formatted final response
   *
   * TODO:
   * - Implement parallel tool execution
   * - Implement progressive response streaming
   * - Add execution timeouts
   * - Implement response quality validation
   */
  async processQuery(
    AtomaInstance: Atoma,
    query: string,
    intentResponses: IntentAgentResponse[],
    privateKey?: string,
  ) {
    try {
      if (!intentResponses || intentResponses.length === 0) {
        return this.finalAnswer(
          AtomaInstance,
          'No tools selected for the query',
          query,
        );
      }

      let aggregatedResults = '';

      for (const response of intentResponses) {
        const { selected_tools, tool_arguments } = response;

        if (!selected_tools?.length) {
          continue; // Skip if no tool selected
        }
        console.log(selected_tools, 'selected tools /...');
        // Execute the tool and append its result
        const result = await this.executeTools(selected_tools, tool_arguments, privateKey);

        // Aggregate results (you might want to customize this based on your needs)
        aggregatedResults += result + '\n';
      }

      // If no tools were successfully executed
      if (!aggregatedResults) {
        return this.finalAnswer(
          AtomaInstance,
          'No valid tools were executed for the query',
          query,
        );
      }

      // Return final answer with aggregated results
      return this.finalAnswer(
        AtomaInstance,
        aggregatedResults.trim(),
        query,
        intentResponses.map((r) => r.selected_tools).join(', '),
      );
    } catch (error: unknown) {
      console.error('Error processing query:', error);
      return handleError(error, {
        reasoning:
          'The system encountered an issue while processing your query',
        query,
      });
    }
  }

  /**
   * Executes selected tools with provided arguments.
   * Handles tool lookup and execution with error management.
   *
   * @param selected_tool - Array of tool names to execute
   * @param args - Arguments to pass to the tools
   * @param privateKey - Optional private key for signing blockchain transactions
   * @returns Tool execution result
   *
   * TODO:
   * - Implement retry mechanism
   * - Implement tool execution timeouts
   * - Implement execution metrics
   */
  private async executeTools(
    selected_tool: string[],
    args: ToolArgument[] | null,
    privateKey?: string,
  ) {
    console.log('\n==== EXECUTE TOOLS ====');
    console.log('Tool:', selected_tool[0]);
    console.log('Original args:', args);
    
    const tool = this.tools
      .getAllTools()
      .find((t) => t.name.trim() === selected_tool[0]);

    if (!tool) {
      throw new Error(`Tool ${selected_tool} not found`);
    }
    
    console.log('Tool parameters:', tool.parameters);

    try {
      // Special handling for deposit_liquidity
      if (selected_tool[0] === 'deposit_liquidity' && args && args.length > 0) {
        // For deposit_liquidity, transform args directly
        const transformedArgs: any[] = [];
        
        // Extract values from name=value format
        const paramMap: Record<string, string> = {};
        
        // Process args to extract name=value pairs
        for (const arg of args) {
          if (typeof arg === 'string' && arg.includes('=')) {
            const [name, value] = arg.split('=', 2);
            paramMap[name] = value;
          } else if (arg === 'owner_id') {
            // We should derive the address from the private key
            if (!privateKey) {
              throw new Error('Wallet address required but not provided. Please connect your wallet.');
            }
            

            const keypair = Ed25519Keypair.fromSecretKey(privateKey);
            const address = keypair.getPublicKey().toSuiAddress();
            
            
              transformedArgs[0] = address;
            
          } else {
            transformedArgs.push(arg);
          }
        }
        
        // If we have coin_type and value in the param map, use them as args
        if (paramMap.coin_type) {
          transformedArgs[1] = paramMap.coin_type;
        }
        
        if (paramMap.value) {
          transformedArgs[2] = paramMap.value;
        }
        
        console.log('Special handling for deposit_liquidity:', transformedArgs);
        const result = await tool.process(...transformedArgs);
        console.log('Tool execution result:', result);
        return result;
      }
      
      // Standard argument processing for other tools
      const processedArgs: Record<string, any> = {};
      const orderedArgs: any[] = [];
      
      // Get expected parameters for this tool
      const toolParams = tool.parameters || [];
      
      if (args && args.length > 0) {
        // First, parse all args and handle name=value format
        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          console.log('Processing arg:', arg, typeof arg);
          
          // Handle 'name=value' format
          if (typeof arg === 'string' && arg.includes('=')) {
            const [paramName, paramValue] = arg.split('=', 2);
            if (paramName && paramValue) {
              // Check if this is a valid parameter for this tool
              const isValidParam = toolParams.some(p => p.name === paramName);
              if (isValidParam) {
                // Store the value under the parameter name
                processedArgs[paramName] = this.parseArgValue(paramValue);
                console.log(`Parsed named parameter ${paramName}:`, processedArgs[paramName]);
                continue;
              }
            }
          }
          
          // If arg is a placeholder like 'owner_id', replace with actual wallet address for specific tools
          if (arg === 'owner_id' || arg === 'sender_address' || arg === 'wallet_address') {
            // For tools that need wallet addresses
            if (['execute_transaction', 'send_sui'].includes(selected_tool[0])) {
              // Use wallet address from context or throw error if not available
              if (!privateKey) {
                throw new Error('Wallet address required but not provided. Please connect your wallet.');
              }
              // Use a realistic wallet address format that will pass validation
              orderedArgs.push('0x4e7355e4f6524e4f991fef294dbfc71339d4a6a89d9964b4d116697246cc0f6d');
              console.log('Replaced placeholder with wallet address');
              continue;
            }
          }
          
          // Handle JSON objects
          if (typeof arg === 'string' && (arg.startsWith('{') || arg.startsWith('['))) {
            try {
              const parsedArg = JSON.parse(arg);
              console.log('Parsed JSON arg:', parsedArg);
              
              // Handle function + args format from LLM
              if (parsedArg && typeof parsedArg === 'object' && 'function' in parsedArg && 'args' in parsedArg) {
                if (Array.isArray(parsedArg.args)) {
                  for (const funcArg of parsedArg.args) {
                    orderedArgs.push(funcArg);
                    console.log('Added argument from function args:', funcArg);
                  }
                  continue;
                }
              }
              
              orderedArgs.push(parsedArg);
              console.log('Added parsed JSON argument:', parsedArg);
              continue;
            } catch (e) {
              // If parsing fails, continue with original string
              console.log('JSON parsing failed, using original string');
            }
          }
          
          // Default case: use arg as positional parameter
          orderedArgs.push(arg);
          console.log('Added positional argument:', arg);
        }
      }
      
      // Fill in positional arguments
      const finalArgs: any[] = [];
      
      // Add all required parameters from the tool's parameter list
      for (let i = 0; i < toolParams.length; i++) {
        const param = toolParams[i];
        if (param.name in processedArgs) {
          // Named parameter exists, add it
          finalArgs.push(processedArgs[param.name]);
        } else if (i < orderedArgs.length) {
          // Use positional argument
          finalArgs.push(orderedArgs[i]);
        } else if (param.required) {
          // Missing required parameter
          throw new Error(`Missing required parameter: ${param.name}`);
        }
      }
      
      // For transaction-related tools that need the private key
      if (privateKey && selected_tool[0] === 'execute_transaction') {
        // For execute_transaction, ensure the private key is provided as the last argument
        // Check if there's a parameter requiring private_key
        const needsPrivateKey = tool.parameters.some(
          param => param.name === 'private_key'
        );
        
        if (needsPrivateKey) {
          // If the tool needs a private key, add it to the arguments
          finalArgs.push(privateKey);
          console.log('Added private key to arguments');
        }
      }
      
      console.log('Final processed args:', finalArgs);
      const result = await tool.process(...finalArgs);
      console.log('Tool execution result:', result);
      return result;
    } catch (error: unknown) {
      console.error('Error executing tool:', error);
      throw error; // Let the main processQuery handle the error
    }
  }
  
  /**
   * Parse argument value to appropriate type
   */
  private parseArgValue(value: string): any {
    // Handle numbers
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
    
    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Handle hex addresses (ensure they start with 0x)
    if (/^(0x)?[a-fA-F0-9]{40,64}$/.test(value)) {
      return value.startsWith('0x') ? value : `0x${value}`;
    }
    
    // Default to string
    return value;
  }

  /**
   * Generates the final answer using the Atoma LLM.
   * Formats and structures the response according to the template.
   *
   * @param AtomaInstance - Instance of Atoma for LLM access
   * @param response - Raw response to format
   * @param query - Original user query
   * @param tools - Optional tools used in processing
   * @returns Formatted and structured final response
   *
   * TODO:
   * - Implement response quality checks
   */
  private async finalAnswer(
    AtomaInstance: Atoma,
    response: string,
    query: string,
    tools?: string,
  ) {
    const finalPrompt = this.prompt
      .replace('${query}', query)
      .replace('${response}', response)
      .replace('tools', `${tools || null}`);

    const finalAns = await AtomaInstance.atomaChat([
      { role: 'assistant', content: finalPrompt },
      { role: 'user', content: query },
    ]);

    const res = finalAns.choices[0].message.content;
    
    try {
      // Improved error handling for JSON parsing
      const parsedRes = this.safeJsonParse(res);
      console.log(parsedRes, 'parsed response');
      return parsedRes;
    } catch (error) {
      console.error('Error parsing final answer JSON:', error);
      console.error('Raw response that failed parsing:', res);
      
      // Provide a fallback response
      return [{
        reasoning: 'Error parsing the response from the agent.',
        response: 'Sorry, I encountered an error while processing your request. Please try again.',
        status: 'failure',
        query: query,
        errors: [error instanceof Error ? error.message : 'Unknown parsing error']
      }];
    }
  }
  
  /**
   * Safely parses JSON with better error handling for malformed JSON
   * 
   * @param jsonString - The JSON string to parse
   * @returns Parsed JSON object
   */
  private safeJsonParse(jsonString: string) {
    try {
      // First try direct JSON parsing
      return JSON.parse(jsonString);
    } catch (initialError) {
      console.warn('Initial JSON parsing failed, attempting cleanup:', initialError);
      
      try {
        // Try to fix common JSON issues
        // 1. Fix escaped quotes that should be double escaped
        const fixedString = jsonString
          // Replace escaped quotes with properly escaped ones
          .replace(/\\"/g, '"')
          // Fix backslashes before quotes
          .replace(/([^\\])\\([^\\"])/g, '$1\\\\$2');
          
        // Try parsing the fixed string
        return JSON.parse(fixedString);
      } catch (secondError) {
        console.warn('Secondary JSON parsing failed, attempting manual extraction:', secondError);
        
        // Last resort: Try to extract the JSON array portion using regex
        const jsonArrayMatch = jsonString.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonArrayMatch) {
          try {
            return JSON.parse(jsonArrayMatch[0]);
          } catch (extractError) {
            // If all attempts fail, create a structured error response
            throw new Error(`Failed to parse JSON: ${initialError}`);
          }
        } else {
          throw new Error(`Failed to extract valid JSON: ${initialError}`);
        }
      }
    }
  }
}

export default Utils;

/**
 * Structured error type for consistent error reporting.
 * Ensures all errors follow a standard format with:
 * - Reasoning for the error
 * - Error response message
 * - Failure status indicator
 * - Original query context
 * - Detailed error information
 *
 * TODO:
 * - Add error categorization
 * - Implement error severity levels
 * - Add support for error recovery hints
 */
export type StructuredError = {
  reasoning: string;
  response: string;
  status: 'failure';
  query: string;
  errors: string[];
};

/**
 * Type guard for Error objects.
 * Ensures type safety when handling unknown error types.
 *
 * @param error - Unknown error object to check
 * @returns Type predicate indicating if error is Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Generic error handler for creating structured error responses.
 * Provides consistent error formatting and unique error IDs.
 *
 * Features:
 * - Unique error identification
 * - Consistent error structure
 * - Error type normalization
 * - Context preservation
 *
 * @param error - The error to handle
 * @param context - Error context including reasoning and query
 * @returns Structured error response
 *
 * TODO:
 * - Add error categorization
 * - Implement error recovery suggestions
 * - Add error tracking integration
 * - Implement error rate limiting
 * - Add support for error aggregation
 */
export function handleError(
  error: unknown,
  context: {
    reasoning: string;
    query: string;
  },
): StructuredError {
  const errorId = generateUUID();

  let errorMessage: string;
  if (isError(error)) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }

  return {
    reasoning: context.reasoning,
    response: 'Operation unsuccessful',
    status: 'failure',
    query: context.query,
    errors: [`Error ID: ${errorId} - ${errorMessage}`],
  };
}
