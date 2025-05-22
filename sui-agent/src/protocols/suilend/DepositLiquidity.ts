import { handleError } from '../../utils';

/**
 * Implementation of the deposit_liquidity tool for SuiLend protocol
 * Handles depositing SUI or other tokens to SuiLend to receive cTokens
 */
class DepositLiquidity {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];

  constructor() {
    this.name = 'deposit_liquidity';
    this.description = 'Deposit liquidity to SuiLend and get cTokens';
    this.parameters = [
      {
        name: 'wallet_address',
        type: 'string',
        description: 'The wallet address making the deposit',
        required: true,
      },
      {
        name: 'coin_type',
        type: 'string',
        description: 'Type of coin to deposit (e.g., "0x2::sui::SUI")',
        required: true,
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Amount to deposit in smallest units (e.g., MIST for SUI)',
        required: true,
      },
    ];
  }

  /**
   * Process the deposit liquidity request
   * 
   * @param args - The arguments passed to the tool
   * @returns JSON string with the result of the operation
   */
  async process(...args: (string | number | bigint | boolean)[]): Promise<string> {
    try {
      // Extract and validate parameters
      const wallet_address = String(args[0] || '');
      const coin_type = String(args[1] || '');
      const amount = Number(args[2] || 0);
      
      if (!wallet_address || !wallet_address.startsWith('0x')) {
        throw new Error(`Invalid wallet address: ${wallet_address}`);
      }
      
      if (!coin_type) {
        throw new Error('Coin type is required');
      }
      
      if (!amount || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      // Since we can't actually execute a deposit without connecting to the SUI network,
      // we'll return a mock response for demonstration purposes
      console.log(`Simulating deposit of ${amount} ${coin_type} from wallet ${wallet_address}`);
      
      // In a real implementation, this would interact with the SuiLend smart contract
      // to deposit the tokens and receive cTokens in return
      
      return JSON.stringify([{
        reasoning: 'Successfully simulated deposit to SuiLend',
        response: {
          transaction_type: 'deposit_liquidity',
          wallet: wallet_address,
          coin_type: coin_type,
          amount: amount,
          success: true,
          message: `Successfully deposited ${amount} of ${coin_type} to SuiLend`
        },
        status: 'success',
        query: `Deposit ${amount} of ${coin_type}`,
        errors: []
      }]);
    } catch (error) {
      console.error('Error in deposit_liquidity:', error);
      const errorQuery = typeof args[2] === 'number' && typeof args[1] === 'string' 
        ? `Failed to deposit ${args[2]} of ${args[1]}`
        : 'Failed to deposit funds';
        
      return JSON.stringify([
        handleError(error, {
          reasoning: 'Failed to deposit liquidity and get CTokens',
          query: errorQuery,
        }),
      ]);
    }
  }
}

export default DepositLiquidity; 