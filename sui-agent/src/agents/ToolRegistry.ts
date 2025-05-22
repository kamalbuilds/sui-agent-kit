import Tools from '../utils/tools';
import AfterMath from '../protocols/aftermath/tools';
import Navi from '../protocols/navi/tools';
import Cetus from '../protocols/cetus/tools';
import Suilend from '../protocols/suilend/tools';
import TransactionTools from '../transactions/tools';
import DepositLiquidity from '../protocols/suilend/DepositLiquidity';

/* 
format for tool registry is:
tool name, tool description, tool arguments, process(function)
*/

/**
 * Registers all available tools with the Tools manager.
 * This function serves as the central registry for all tool implementations.
 * 
 * @param tools - The Tools instance to register tools with
 */
export function registerAllTools(tools: Tools) {
  //after math tools
  AfterMath.registerTools(tools);
  //navi tools
  Navi.registerTools(tools);
  // Cetus tools
  Cetus.registerTools(tools);
  // Transaction Tools
  TransactionTools.registerTools(tools);
  // Suilend tools
  Suilend.registerTools(tools);
  
  // Register individual tools
  registerIndividualTools(tools);
}

/**
 * Registers individual tool implementations directly
 * This allows for adding tools without needing to create tool group classes
 * 
 * @param tools - The Tools instance to register tools with
 */
function registerIndividualTools(tools: Tools) {
  // List of standalone tools
  const depositLiquidity = new DepositLiquidity();
  
  // Register each standalone tool
  tools.registerTool(
    depositLiquidity.name,
    depositLiquidity.description,
    depositLiquidity.parameters,
    // Use type assertion to match the expected function signature
    depositLiquidity.process.bind(depositLiquidity) as (...args: (string | number | bigint | boolean)[]) => Promise<string>
  );
}
