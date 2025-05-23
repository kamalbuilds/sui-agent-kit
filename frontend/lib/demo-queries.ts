// Demo Queries for SUI AI Agent Kit - Showcasing Multi-Protocol DeFi Interactions
// Each query demonstrates different protocols and complex DeFi operations

export interface DemoQuery {
  id: number;
  category: string;
  protocols: string[];
  query: string;
  aiResponse: {
    status: "success" | "error" | "pending";
    message: string;
    executionTime: string;
    gasUsed: string;
    transactionHashes: string[];
  };
}

export const demoQueries: DemoQuery[] = [
  {
    id: 1,
    category: "Cross-Protocol Yield Farming",
    protocols: ["Aftermath Finance", "Turbos Finance"],
    query: "I want to maximize my yield with 10 SUI. First stake 6 SUI for afSUI on Aftermath, then provide liquidity to the afSUI-SUI pool on Turbos with the highest APR, and stake the remaining 4 SUI in the best validator through Aftermath.",
    aiResponse: {
      status: "success",
      message: "🚀 Multi-Protocol Yield Strategy Executed Successfully!\n\n\nStep 1: Liquid Staking on Aftermath Finance ✅\n• Staked 6 SUI → Received 5.97 afSUI\n• Current afSUI APY: 7.2%\n• Exchange Rate: 1 afSUI = 1.005 SUI\n• Transaction: FWvWpf3s4AhR3rHHgqcYvzGpvBhb5Npy3pJhPHNRL5Y2\n\n\nStep 2: Concentrated Liquidity on Turbos Finance ✅\n• Pool: afSUI-SUI (0.05% fee tier)\n• Liquidity Added: 5.97 afSUI + 6 SUI\n• Pool APR: 22.4% (High activity from liquid staking flows)\n• Position NFT ID: 0x7b4a9c8e2f5d6a1b3c4e7f8a9b0c1d2e3f4a5b6c7d8e\n• Transaction: 394biJjWioos7QAkusvV1AUcr2pYmcm4pSd4hoY7jrLX\n\n\nStep 3: Additional SUI Staking ✅\n• Validator: Aftermath Validator (Fee: 3%, APY: 3.2%)\n• Staked: 4 SUI → Will receive staking rewards\n• Delegation successful, rewards start next epoch\n• Transaction: 7W9aLcdPoDfrJTTuV7Na3gZE3AHj8UBNtYjV1kLEtKiV\n\n\n📊 Portfolio Summary:\n• Total Investment: 10 SUI (includes gas fees)\n• Expected Annual Yield: ~17.8% weighted average\n• Liquid Staking: 7.2% APY on 6 SUI\n• LP Position: 22.4% APR on ~12 SUI equivalent\n• Direct Staking: 3.2% APY on 4 SUI\n• Estimated Monthly Earnings: ~0.15 SUI\n\n\n🎯 Strategy Benefits:\n✓ Diversified across liquid staking, LP, and direct staking\n✓ afSUI maintains liquidity while earning staking rewards\n✓ LP position captures trading fees from afSUI-SUI swaps\n✓ Direct staking provides baseline secure yield\n\n\nNext Steps:\n• Monitor LP position performance on Turbos dashboard\n• Consider rebalancing based on pool performance\n• Claim rewards regularly to compound gains\n\nAll transactions executed successfully on Sui Mainnet",
      executionTime: "4.2 seconds",
      gasUsed: "0.0023 SUI",
      transactionHashes: [
        "FWvWpf3s4AhR3rHHgqcYvzGpvBhb5Npy3pJhPHNRL5Y2",
        "394biJjWioos7QAkusvV1AUcr2pYmcm4pSd4hoY7jrLX", 
        "7W9aLcdPoDfrJTTuV7Na3gZE3AHj8UBNtYjV1kLEtKiV"
      ]
    }
  },

  {
    id: 2,
    category: "Advanced Lending Strategy",
    protocols: ["Navi Protocol", "Aftermath Finance"],
    query: "I have 30 USDC. Supply 25 USDC to Navi Protocol, borrow 12 USDC against it, then use the borrowed USDC to buy SUI and stake it for afSUI. Monitor my health factor and set up alerts if it drops below 2.0.",
    aiResponse: {
      status: "success",
      message: "💰 Advanced Lending Strategy Successfully Deployed!\n\n\nStep 1: USDC Supply to Navi Protocol ✅\n• Supplied: 25 USDC to Navi lending pool\n• Current Supply APY: 4.8%\n• Supply Transaction: AMyMy8KGbgvkn6EeqTXWeysFTnZQS9H8oCyuXjFk3B1J\n\n\nStep 2: Strategic Borrowing ✅\n• Borrowed: 12 USDC (48% LTV ratio)\n• Borrow APY: 6.2%\n• Health Factor: 2.6 (Safe zone)\n• Borrow Transaction: AJPDDo4HZ6BjJTUQwaQiYQe4Vk1bQiMzRUZ2Y1ep8yq3\n\n\nStep 3: SUI Purchase & Liquid Staking ✅\n• Swapped 12 USDC → 3.4 SUI (Price: $3.56/SUI)\n• Used Aftermath Finance smart router for best execution\n• Swap Transaction: DZ5u2CrZ1EpVveak4mgx3ut84EzUgnnrJaXLqJdbEefc\n• Staked 3.4 SUI → Received 3.38 afSUI\n• afSUI Staking APY: 7.2%\n• Stake Transaction: Es9cuFCXYwC23qJY5a2VsbeBgGi1HT3fNgZsQr9DsKw\n\n\nStep 4: Health Monitoring Setup ✅\n• Health factor alerts configured for threshold: 2.0\n• Current health factor: 2.6 ✨ (Healthy)\n• Liquidation threshold: 75% LTV (1.33 health factor)\n• Alert channels: Email + Push notifications\n• Monitoring Transaction: 6tY8uI3oP2lK5nJ0hG4fD7sA1qW9eR6mNbVcXzL8kJ2\n\n\n📊 Position Analysis:\n• Collateral Value: $25 USDC\n• Debt: 12 USDC (6.2% APY)\n• afSUI Holdings: 3.38 afSUI (~$12.1 value)\n• Net APY: ~3.1% (7.2% earn - 6.2% cost + supply yield)\n• Liquidation Price: SUI < $2.37 (current: $3.56)\n\n\n🎯 Strategy Metrics:\n• Leverage Ratio: 1.48x exposure to SUI\n• Capital Efficiency: Using borrowed funds to amplify SUI exposure\n• Yield Enhancement: Earning liquid staking rewards on leveraged position\n• Risk Level: Moderate (2.6 health factor provides good buffer)\n\n\nRisk Management:\n• Monitor SUI price movements closely\n• Health factor alerts at 2.0 provide early warning\n• Consider partial debt repayment if SUI price drops 25%\n• afSUI can be unstaked and sold if needed for deleveraging\n\n\nActive Monitoring:\n• Real-time health factor tracking: ENABLED\n• Price alerts for SUI at key levels: SET\n• Weekly position review reminders: SCHEDULED\n• Auto-liquidation protection suggestions: ACTIVE\n\nPosition successfully established with robust risk management",
      executionTime: "6.8 seconds",
      gasUsed: "0.0041 SUI",
      transactionHashes: [
        "AMyMy8KGbgvkn6EeqTXWeysFTnZQS9H8oCyuXjFk3B1J",
        "AJPDDo4HZ6BjJTUQwaQiYQe4Vk1bQiMzRUZ2Y1ep8yq3",
        "DZ5u2CrZ1EpVveak4mgx3ut84EzUgnnrJaXLqJdbEefc",
        "Es9cuFCXYwC23qJY5a2VsbeBgGi1HT3fNgZsQr9DsKw",
        "6tY8uI3oP2lK5nJ0hG4fD7sA1qW9eR6mNbVcXzL8kJ2"
      ]
    }
  },

  {
    id: 3,
    category: "Perpetual Trading with Risk Management", 
    protocols: ["Bluefin Exchange", "Aftermath Finance"],
    query: "Open a 3x leveraged long position on SUI-PERP with 15 USDC margin on Bluefin. Set a stop loss at 15% below entry and take profit at 30% above entry. Also buy 3 SUI spot as a hedge and provide analysis of this strategy.",
    aiResponse: {
      status: "success",
      message: "⚡ **Leveraged Trading Strategy with Hedging Deployed!**\n\n**Step 1: Bluefin Perpetual Position** ✅\n• **Position Type:** Long SUI-PERP\n• **Leverage:** 3x\n• **Margin Posted:** 15 USDC\n• **Position Size:** $45 notional (12.6 SUI equivalent)\n• **Entry Price:** $3.56 per SUI\n• **Funding Rate:** -0.0024% (8h) - Favorable for longs\n• **Position ID:** 0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d\n• **Open Transaction:** `3mK9jL2nH6gF8dS5aQ4wE7rT1yU0iP9oM3vB6cX1zN5`\n\n**Step 2: Risk Management Orders** ✅\n• **Stop Loss:** $3.03 (-15% from entry, -$33.8 max loss)\n• **Take Profit:** $4.63 (+30% from entry, +$67.5 target gain)\n• **Risk/Reward Ratio:** 1:2 (Favorable)\n• **Orders Transaction:** `7rT4yU8iP2oM9vB3cX6zN1lK5nJ0hG4fD8sA2qW6eR9`\n\n**Step 3: Spot Hedge Position** ✅\n• **Spot Purchase:** 3 SUI at $3.56\n• **Cost:** $10.68 USDC\n• **Purpose:** Delta hedge + long-term holding\n• **Spot Transaction:** `1qW5eR8tY2uI6oP9lK3nJ7hG0fD4sA1mNbVcXzL5kJ8`\n\n**📊 Strategy Analysis:**\n\n**Position Structure:**\n• **Perp Exposure:** +12.6 SUI (3x leveraged)\n• **Spot Exposure:** +3 SUI (unlevered)\n• **Net Delta:** +15.6 SUI equivalent\n• **Total Capital:** $25.68 USDC committed\n\n**Risk Metrics:**\n• **Maximum Loss:** $33.8 (perp stop loss) + $3.2 (spot 30% drop) = $37\n• **Maximum Gain:** $67.5 (perp TP) + spot upside unlimited\n• **Breakeven:** SUI at $3.56 (entry price)\n• **Liquidation Price:** $2.97 (perp position)\n\n**🎯 Strategy Benefits:**\n✓ **Asymmetric Risk/Reward:** 1:2 ratio on perp position\n✓ **Hedge Protection:** Spot position provides downside cushion\n✓ **Funding Income:** Negative funding rate benefits long position\n✓ **Flexible Exit:** Can close positions independently\n\n**📈 Scenario Analysis:**\n\n**Bull Case (+30% SUI move to $4.63):**\n• Perp P&L: +$67.5 (TP hit)\n• Spot P&L: +$3.21\n• **Total Gain:** ~$70.7 (+275% on capital)\n\n**Bear Case (-15% SUI move to $3.03):**\n• Perp P&L: -$33.8 (SL hit)\n• Spot P&L: -$1.60\n• **Total Loss:** ~$35.4 (-138% on capital)\n\n**📊 Real-time Monitoring:**\n• **Current P&L:** $0 (just opened)\n• **Unrealized Funding:** +$0.02\n• **Position Health:** Excellent (well above liquidation)\n• **Market Sentiment:** Bullish (recent +8% weekly move)\n\n**⚠️ Risk Warnings:**\n• Moderate leverage amplifies both gains and losses\n• Funding rates can change and impact costs\n• Spot position provides partial hedge but not full protection\n• Consider position sizing relative to total portfolio\n\n**🔄 Management Suggestions:**\n• Trail stop loss if position moves favorably\n• Consider taking partial profits at +15% to reduce risk\n• Monitor funding rates for cost implications\n• Watch SUI ecosystem developments for fundamental drivers\n\n*Advanced trading strategy deployed with comprehensive risk management*",
      executionTime: "5.7 seconds", 
      gasUsed: "0.0035 SUI",
      transactionHashes: [
        "3mK9jL2nH6gF8dS5aQ4wE7rT1yU0iP9oM3vB6cX1zN5",
        "7rT4yU8iP2oM9vB3cX6zN1lK5nJ0hG4fD8sA2qW6eR9",
        "1qW5eR8tY2uI6oP9lK3nJ7hG0fD4sA1mNbVcXzL5kJ8"
      ]
    }
  },

  {
    id: 4,
    category: "Cross-Protocol Arbitrage & Portfolio Optimization",
    protocols: ["Turbos", "Aftermath Finance", "Navi Protocol"],
    query: "Analyze arbitrage opportunities between Turbos and Aftermath for SUI/USDC pairs. If profitable, execute the arbitrage with 20 USDC. Then rebalance my entire portfolio to 40% SUI, 30% USDC, 20% afSUI, and 10% in the highest APY lending pool on Navi.",
    aiResponse: {
      status: "success", 
      message: "🔍 **Cross-Protocol Arbitrage & Portfolio Optimization Complete!**\n\n**Step 1: Arbitrage Analysis** ✅\n\n**Price Discovery:**\n• **Turbos SUI/USDC:** $3.5542 per SUI\n• **Aftermath SUI/USDC:** $3.5617 per SUI\n• **Price Difference:** +0.21% (profitable threshold: >0.15%)\n• **Opportunity:** BUY on Turbos, SELL on Aftermath\n\n**Arbitrage Execution:**\n• **Capital:** 20 USDC\n• **Buy on Turbos:** 20 USDC → 5.63 SUI\n• **Sell on Aftermath:** 5.63 SUI → 20.04 USDC\n• **Gross Profit:** 0.04 USDC\n• **Gas Costs:** 0.012 USDC\n• **Net Profit:** 0.028 USDC (+0.14% return)\n• **Execution Time:** 2.8 seconds\n• **Buy Transaction:** `4sA7qW2eR5tY8uI1oP4lK6nJ9hG3fD0mNbVcXzL7kJ5`\n• **Sell Transaction:** `8hG1fD4sA0qW5eR2tY7uI3oP6lK9nJ2mNbVcXzL4kJ8`\n\n**Step 2: Portfolio Rebalancing Analysis** ✅\n\n**Current Portfolio Detected:**\n• SUI: 3.2 tokens ($11.39)\n• USDC: 25 tokens\n• afSUI: 0.8 tokens ($2.85)\n• NAVI USDC Position: $12 supplied\n• **Total Value:** $51.24\n\n**Target Allocation:**\n• 40% SUI: $20.50 (needed: 5.76 SUI)\n• 30% USDC: $15.37 (needed: 15.37 USDC)\n• 20% afSUI: $10.25 (needed: 2.88 afSUI)\n• 10% High-APY: $5.12 (DEEP lending at 12.4% APY)\n\n**Step 3: Rebalancing Execution** ✅\n\n**Transactions Executed:**\n\n1. **SUI Adjustment:** Bought 2.56 SUI with $9.11 USDC\n   • Transaction: `2mN7bV4cX9zL1kJ6hG3fD8sA5qW0eR2tY4uI7oP1lK9`\n\n2. **afSUI Acquisition:** Bought 2.08 afSUI with $7.40 USDC\n   • Used Aftermath liquid staking\n   • Transaction: `6oP3lK8nJ1hG4fD7sA0qW3eR5tY2uI9bVcXzL6kJ1hG`\n\n3. **NAVI DEEP Lending:** Supplied $5.12 to DEEP pool\n   • APY: 12.4% (highest available)\n   • Health factor: N/A (supply only)\n   • Transaction: `0qW8eR1tY4uI7oP2lK5nJ3hG6fD9sA4mNbVcXzL0kJ7`\n\n**📊 Final Portfolio Allocation:**\n• **SUI:** 5.76 tokens (40.0%) - $20.50\n• **USDC:** 15.37 tokens (30.0%) - $15.37  \n• **afSUI:** 2.88 tokens (20.0%) - $10.25\n• **DEEP (Navi):** 28.4 tokens (10.0%) - $5.12\n• **Total Value:** $51.24 ✨\n\n**💰 Yield Optimization Results:**\n\n**Expected Annual Yields:**\n• SUI: 3.2% (base staking yield)\n• USDC: 0% (holding for liquidity)\n• afSUI: 7.2% (liquid staking rewards)\n• DEEP (Navi): 12.4% (lending APY)\n• **Weighted Portfolio APY:** 4.67%\n• **Projected Annual Income:** ~$2.39 (in crypto terms)\n\n**🎯 Optimization Benefits:**\n✓ **Diversified Risk:** Spread across multiple assets and protocols\n✓ **Yield Maximization:** 12.4% APY on 10% allocation significantly boosts returns\n✓ **Liquidity Maintained:** 30% USDC for opportunities and stability\n✓ **SUI Exposure:** 60% total SUI exposure (direct + afSUI) for ecosystem growth\n✓ **Arbitrage Profit:** Additional 0.028 USDC gained from price differences\n\n**📈 Performance Tracking:**\n• **Total Transactions:** 5 successful executions\n• **Total Gas Used:** 0.0089 SUI\n• **Execution Time:** 8.2 seconds\n• **Slippage:** <0.1% on all trades\n• **Portfolio Beta:** 0.85 (moderate risk vs SUI)\n\n**🔄 Ongoing Monitoring:**\n• Daily arbitrage opportunity scans scheduled\n• Weekly portfolio rebalancing alerts set\n• APY tracking across all positions enabled\n• Risk metrics monitoring for DEEP lending position\n\n**Next Recommended Actions:**\n• Monitor DEEP token performance and lending rates\n• Consider DCA strategies for USDC allocation\n• Watch for new high-APY opportunities on Navi\n• Set up automated rebalancing at ±5% allocation drift\n\n*Portfolio successfully optimized with arbitrage profits captured*",
      executionTime: "8.2 seconds",
      gasUsed: "0.0089 SUI", 
      transactionHashes: [
        "4sA7qW2eR5tY8uI1oP4lK6nJ9hG3fD0mNbVcXzL7kJ5",
        "8hG1fD4sA0qW5eR2tY7uI3oP6lK9nJ2mNbVcXzL4kJ8",
        "2mN7bV4cX9zL1kJ6hG3fD8sA5qW0eR2tY4uI7oP1lK9",
        "6oP3lK8nJ1hG4fD7sA0qW3eR5tY2uI9bVcXzL6kJ1hG",
        "0qW8eR1tY4uI7oP2lK5nJ3hG6fD9sA4mNbVcXzL0kJ7"
      ]
    }
  },

  {
    id: 5,
    category: "Institutional DeFi Strategy",
    protocols: ["Suilend Protocol", "Navi Protocol", "Aftermath Finance"],
    query: "Create a custom lending market on Suilend for USDY (Ondo's real-world asset token). Set conservative parameters, then deposit 150 USDC across Suilend and Navi for diversified institutional exposure. Provide risk analysis and compliance considerations.",
    aiResponse: {
      status: "success",
      message: "🏦 **Institutional DeFi Strategy Successfully Deployed!**\n\n**Step 1: Custom USDY Lending Market Creation** ✅\n\n**Suilend Market Configuration:**\n• **Asset:** USDY (Ondo US Dollar Yield)\n• **Market Type:** Isolated (risk-contained)\n• **Collateral Factor:** 70% (conservative for RWA)\n• **Liquidation Threshold:** 75%\n• **Reserve Factor:** 15% (protocol revenue)\n• **Interest Rate Model:** Kink at 80% utilization\n  - Base Rate: 0%\n  - Kink Rate: 4.5%\n  - Max Rate: 50%\n• **Supply Cap:** $10M (initial conservative limit)\n• **Borrow Cap:** $7M (70% of supply cap)\n• **Oracle:** Pyth Network + Ondo price feeds\n• **Market Creation Transaction:** `9xR3tY6uI2oP5lK8nJ1hG4fD7sA0qW9eR3mNbVcXzL2`\n\n**Step 2: Diversified Institutional Deposits** ✅\n\n**Suilend Allocation ($75):**\n• **USDY Market:** $45 (60% of Suilend allocation)\n  - Expected APY: 5.2% (RWA yield + protocol rewards)\n  - Supply Transaction: `5aQ2wE8rT4yU7iP0oM6vB9cX3zN1lK4nJ8hG2fD6sA0`\n• **Native USDC Market:** $30 (40% of Suilend allocation)\n  - Expected APY: 4.1% (stable rate)\n  - Supply Transaction: `7nJ4hG1fD5sA8qW2eR6tY9uI3oP0lK7nJ4mNbVcXzL5`\n\n**Navi Protocol Allocation ($75):**\n• **USDC Main Pool:** $45 (institutional-grade)\n  - Expected APY: 4.8% \n  - Health Factor: N/A (supply only)\n  - Supply Transaction: `1kJ8hG5fD2sA7qW4eR9tY6uI0oP3lK1nJ4mNbVcXzL8`\n• **USDY Pool:** $30 (for comparison)\n  - Expected APY: 5.0%\n  - Supply Transaction: `3oP6lK9nJ2hG5fD8sA1qW4eR7tY0uI3oP6mNbVcXzL1`\n\n**📊 Institutional Portfolio Summary:**\n\n**Asset Allocation:**\n• **Total Deployed:** $150 USDC\n• **USDY Exposure:** $75 (50% - RWA diversification)\n• **USDC Exposure:** $75 (50% - stable liquidity)\n• **Protocol Split:** 50% Suilend, 50% Navi (platform diversification)\n\n**Risk Metrics:**\n• **Weighted Average APY:** 4.78%\n• **Expected Annual Income:** $7.17\n• **Platform Risk:** Distributed across 2 audited protocols\n• **Asset Risk:** Mixed traditional DeFi + RWA exposure\n• **Liquidity Risk:** Low (lending markets with good utilization)\n\n**🔐 Risk Analysis:**\n\n**Technical Risks:**\n• **Smart Contract Risk:** MEDIUM\n  - Both protocols audited by top firms (OtterSec, Quantstamp)\n  - Battle-tested with $500M+ TVL combined\n  - Diversification reduces single protocol exposure\n\n• **Oracle Risk:** LOW\n  - USDY: Dual oracle system (Pyth + Ondo)\n  - USDC: Multiple oracle providers\n  - Real-time price monitoring enabled\n\n• **Liquidity Risk:** LOW\n  - USDC: Deep liquidity across all markets\n  - USDY: Growing but newer market, monitored utilization\n\n**Market Risks:**\n• **Interest Rate Risk:** LOW-MEDIUM\n  - Variable rates tied to utilization\n  - Current rates in favorable range\n  - Can withdraw if rates deteriorate\n\n• **Counterparty Risk:** LOW\n  - Decentralized protocols with proven governance\n  - No single counterparty dependency\n  - USDY backed by US Treasuries (traditional collateral)\n\n**💼 Compliance Considerations:**\n\n**Regulatory Framework:**\n• **USDY Compliance:**\n  - SEC-regulated RWA token\n  - Qualified institutional buyer (QIB) status may be required\n  - KYC/AML compliance through Ondo platform\n  - Regular attestations from third-party auditors\n\n• **DeFi Lending Compliance:**\n  - Decentralized protocols (no direct regulation)\n  - Monitor evolving DeFi regulatory landscape\n  - Consider jurisdiction-specific requirements\n  - Maintain detailed transaction records\n\n**Reporting Requirements:**\n• **Tax Considerations:**\n  - Interest income taxable as ordinary income\n  - Mark-to-market for institutional accounting\n  - Consider staking rewards tax treatment\n  - Maintain detailed yield tracking\n\n• **Audit Trail:**\n  - All transactions recorded on-chain\n  - Real-time position monitoring available\n  - Automated compliance reporting possible\n  - Integration with institutional accounting systems\n\n**📈 Performance Monitoring:**\n\n**Key Metrics Tracking:**\n• **Daily APY Changes:** Automated alerts for ±50bps moves\n• **Utilization Rates:** Monitor for liquidity availability\n• **Platform Health:** TVL, active users, protocol upgrades\n• **Yield Comparison:** Benchmark against TradFi alternatives\n\n**Risk Management:**\n• **Position Limits:** $150 initial, scalable to $1k+\n• **Concentration Limits:** Max 25% in any single market\n• **Liquidity Buffers:** Maintain 10% in instantly liquid assets\n• **Stress Testing:** Monthly portfolio stress tests\n\n**🔄 Institutional Features:**\n\n**Operational Excellence:**\n• **Multi-signature Governance:** 3-of-5 key management\n• **Automated Reporting:** Daily, weekly, monthly summaries\n• **Professional Integration:** API access for portfolio management\n• **White-glove Support:** Dedicated institutional support channel\n\n**Scalability Options:**\n• **Capacity:** Can scale to $10k+ across protocols\n• **Asset Expansion:** Additional RWA tokens as they launch\n• **Strategy Evolution:** Add borrowing, yield farming as appropriate\n• **Cross-chain:** Potential expansion to other Move-based chains\n\n**Next Steps:**\n• Monitor USDY market adoption and liquidity development\n• Evaluate additional RWA opportunities (stETH, wBTC, etc.)\n• Consider automated rebalancing based on yield changes\n• Prepare quarterly institutional performance reports\n\n*Institutional-grade DeFi strategy deployed with comprehensive risk management and compliance framework*",
      executionTime: "8.9 seconds",
      gasUsed: "0.0067 SUI",
      transactionHashes: [
        "9xR3tY6uI2oP5lK8nJ1hG4fD7sA0qW9eR3mNbVcXzL2",
        "5aQ2wE8rT4yU7iP0oM6vB9cX3zN1lK4nJ8hG2fD6sA0",
        "7nJ4hG1fD5sA8qW2eR6tY9uI3oP0lK7nJ4mNbVcXzL5",
        "1kJ8hG5fD2sA7qW4eR9tY6uI0oP3lK1nJ4mNbVcXzL8",
        "3oP6lK9nJ2hG5fD8sA1qW4eR7tY0uI3oP6mNbVcXzL1"
      ]
    }
  },

  {
    id: 6,
    category: "Multi-Protocol Governance & Social Trading",
    protocols: ["All Protocols", "Cross-Protocol Strategy"],
    query: "I want to create a social trading strategy where followers can copy my DeFi moves. Set up automatic governance voting for NAVX, BUCK, and DEEP tokens based on my holdings. Then execute a 'DeFi diversification basket' buying strategy: 25% each in top 4 Sui DeFi tokens, and document this as a copyable strategy for my followers.",
    aiResponse: {
      status: "success",
      message: "👥 **Social Trading & Governance Strategy Successfully Activated!**\n\n**Step 1: Automated Governance Setup** ✅\n\n**NAVX Token (Navi Protocol):**\n• **Holdings Detected:** 98 NAVX tokens\n• **Voting Power:** 0.01% of total supply\n• **Auto-Voting Rules Set:**\n  - Risk Management Proposals: YES (if reducing platform risk)\n  - Interest Rate Updates: YES (if within ±2% current rates)\n  - New Asset Listings: YES (if properly audited)\n  - Protocol Upgrades: ABSTAIN (manual review required)\n• **Governance Registration:** `4tY7uI0oP3lK6nJ9hG2fD5sA8qW1eR4mNbVcXzL7kJ0`\n\n**BUCK Token (Bucket Protocol):**\n• **Holdings Detected:** 156 BUCK tokens\n• **Voting Power:** 0.004% of circulating supply\n• **Auto-Voting Rules Set:**\n  - Stability Mechanism Updates: YES (if improving peg stability)\n  - Collateral Ratio Changes: YES (if maintaining protocol safety)\n  - Yield Distribution: YES (if benefiting token holders)\n  - Protocol Integrations: MANUAL (requires strategy review)\n• **Governance Registration:** `8nJ2hG5fD1sA4qW7eR0tY3uI6oP9lK2nJ5mNbVcXzL8`\n\n**DEEP Token (DeepBook):**\n• **Holdings Detected:** 278 DEEP tokens\n• **Voting Power:** 0.003% of total supply\n• **Auto-Voting Rules Set:**\n  - Liquidity Mining Programs: YES (if improving market depth)\n  - Market Maker Incentives: YES (if reducing spreads)\n  - Cross-DEX Integrations: YES (if maintaining neutrality)\n  - Revenue Distribution: MANUAL (requires analysis)\n• **Governance Registration:** `2oP5lK8nJ1hG4fD7sA0qW3eR6tY9uI2oP5mNbVcXzL1`\n\n**Step 2: Social Trading Strategy Creation** ✅\n\n**Strategy Profile Created:**\n• **Strategy Name:** \"Sui DeFi Alpha Diversification\"\n• **Strategy Type:** Multi-Protocol Yield + Growth\n• **Risk Level:** Moderate (6/10)\n• **Minimum Follow Amount:** 10 USDC\n• **Maximum Position Size:** 500 USDC\n• **Performance Fee:** 2% on profits\n• **Strategy ID:** 0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d\n• **Registration Transaction:** `6uI9oP2lK5nJ8hG1fD4sA7qW0eR3tY6uI9mNbVcXzL4`\n\n**Step 3: DeFi Diversification Basket Execution** ✅\n\n**Top 4 Sui DeFi Tokens Identified:**\n1. **DEEP (DeepBook)** - Native liquidity layer\n2. **BUCK (Bucket Protocol)** - Decentralized stablecoin protocol  \n3. **NAVX (Navi)** - Top lending protocol\n4. **WAL (Walrus)** - Decentralized storage\n\n**Basket Allocation (40 USDC Total):**\n\n**25% DEEP Allocation ($10):**\n• **Purchase:** 55.6 DEEP tokens at $0.18\n• **Rationale:** Core infrastructure, growing adoption\n• **Expected APY:** 8-12% (staking + ecosystem growth)\n• **Purchase Transaction:** `3lK6nJ9hG2fD5sA8qW1eR4tY7uI0oP3lK6mNbVcXzL9`\n\n**25% BUCK Allocation ($10):**\n• **Purchase:** 10.2 BUCK tokens at $0.98\n• **Rationale:** Stablecoin infrastructure, yield opportunities\n• **Expected APY:** 6-10% (stability pool rewards + governance)\n• **Purchase Transaction:** `7hG0fD3sA6qW9eR2tY5uI8oP1lK4nJ7hG0mNbVcXzL2`\n\n**25% NAVX Allocation ($10):**\n• **Purchase:** 173.6 NAVX tokens at $0.0576\n• **Rationale:** Largest lending protocol, institutional adoption\n• **Expected APY:** 15-25% (protocol revenue + governance)\n• **Purchase Transaction:** `1qW4eR7tY0uI3oP6lK9nJ2hG5fD8sA1qW4mNbVcXzL5`\n\n**25% WAL Allocation ($10):**\n• **Purchase:** 188.7 WAL tokens at $0.053\n• **Rationale:** Infrastructure play, storage demand growth\n• **Expected APY:** 20-35% (early stage, high growth potential)\n• **Purchase Transaction:** `5sA8qW1eR4tY7uI0oP3lK6nJ9hG2fD5sA8mNbVcXzL0`\n\n**📊 Strategy Performance Metrics:**\n\n**Portfolio Composition:**\n• **Total Investment:** $40 USDC\n• **Token Count:** 4 blue-chip Sui DeFi tokens\n• **Diversification Score:** 9.2/10 (well-balanced)\n• **Weighted Expected APY:** 14.8%\n• **Risk Score:** 6.5/10 (moderate, diversified)\n\n**👥 Social Trading Features:**\n\n**Copyable Elements:**\n• **Allocation Strategy:** Fixed 25% allocation model\n• **Rebalancing Rules:** Monthly rebalancing to maintain weights\n• **Entry/Exit Criteria:** Transparent buy/sell signals\n• **Risk Management:** 20% stop-loss per token, 15% overall\n\n**Follower Benefits:**\n• **Automatic Execution:** All trades copied proportionally\n• **Governance Rights:** Followers receive voting power delegation\n• **Performance Transparency:** Real-time tracking dashboard\n• **Educational Content:** Strategy explanations and market insights\n\n**📈 Strategy Documentation:**\n\n**Investment Thesis:**\n\"The Sui DeFi ecosystem is in early growth phase with infrastructure tokens positioned for significant appreciation. This strategy captures diversified exposure across key verticals: liquidity (DEEP), stablecoins (BUCK), lending (NAVX), and storage (WAL).\"\n\n**Risk Factors:**\n• **Protocol Risk:** Smart contract vulnerabilities\n• **Market Risk:** Crypto volatility and correlation\n• **Execution Risk:** Slippage and timing\n• **Regulatory Risk:** Potential DeFi regulations\n\n**Performance Targets:**\n• **12-Month Target:** 50-100% total return\n• **Risk-Adjusted Target:** Sharpe ratio > 1.5\n• **Maximum Drawdown:** <30% from peak\n• **Minimum APY:** 15% base case scenario\n\n**🔄 Ongoing Management:**\n\n**Automated Features:**\n• **Monthly Rebalancing:** Maintain 25% allocation per token\n• **Governance Participation:** Automatic voting on routine proposals\n• **Performance Reporting:** Weekly updates to followers\n• **Risk Monitoring:** Daily position size and correlation checks\n\n**Manual Oversight:**\n• **Strategic Reviews:** Quarterly strategy assessment\n• **Token Evaluation:** Continuous monitoring of fundamentals\n• **Market Analysis:** Weekly DeFi sector commentary\n• **Community Engagement:** Regular follower Q&A sessions\n\n**📱 Social Features Activated:**\n\n**Follower Dashboard:**\n• **Real-time Performance:** Live P&L tracking\n• **Position Details:** Complete transparency on holdings\n• **Trade History:** All historical transactions visible\n• **Educational Insights:** Market commentary and analysis\n\n**Communication Channels:**\n• **Discord Community:** 25+ followers already joined\n• **Weekly Newsletter:** Strategy updates and market insights\n• **Video Analysis:** Bi-weekly strategy review videos\n• **AMA Sessions:** Monthly community Q&A\n\n**💡 Unique Value Propositions:**\n\n**For Followers:**\n✓ **Professional Management:** Experienced DeFi strategy execution\n✓ **Governance Participation:** Amplified voting power through pooling\n✓ **Educational Value:** Learn while earning\n✓ **Risk Management:** Professional risk controls\n\n**For the Ecosystem:**\n✓ **Governance Participation:** Increased voting engagement\n✓ **Liquidity Provision:** Consistent demand for ecosystem tokens\n✓ **Price Discovery:** Fair market value through diversified buying\n✓ **Community Building:** Growing educated user base\n\n**📊 First Week Results:**\n• **Followers:** 12 users copied the strategy\n• **Total AUM:** $520 (including initial $40)\n• **Performance:** +2.8% (strong start)\n• **Community Growth:** 25+ Discord members\n• **Governance Participation:** 8 votes cast across protocols\n\n**Next Phase Roadmap:**\n• **Scale to 50 followers:** Target $2k AUM\n• **Add yield strategies:** Staking and LP provision\n• **Cross-chain expansion:** Extend to other Move chains\n• **Institutional tier:** Professional strategy management\n\n*Social trading strategy successfully launched with comprehensive governance automation and transparent performance tracking*",
      executionTime: "15.2 seconds",
      gasUsed: "0.0125 SUI",
      transactionHashes: [
        "4tY7uI0oP3lK6nJ9hG2fD5sA8qW1eR4mNbVcXzL7kJ0",
        "8nJ2hG5fD1sA4qW7eR0tY3uI6oP9lK2nJ5mNbVcXzL8", 
        "2oP5lK8nJ1hG4fD7sA0qW3eR6tY9uI2oP5mNbVcXzL1",
        "6uI9oP2lK5nJ8hG1fD4sA7qW0eR3tY6uI9mNbVcXzL4",
        "3lK6nJ9hG2fD5sA8qW1eR4tY7uI0oP3lK6mNbVcXzL9",
        "7hG0fD3sA6qW9eR2tY5uI8oP1lK4nJ7hG0mNbVcXzL2",
        "1qW4eR7tY0uI3oP6lK9nJ2hG5fD8sA1qW4mNbVcXzL5",
        "5sA8qW1eR4tY7uI0oP3lK6nJ9hG2fD5sA8mNbVcXzL0"
      ]
    }
  }
];

// Utility functions for demo query matching
export const findDemoQuery = (query: string): DemoQuery | null => {
  // Normalize the query for comparison (remove extra spaces, convert to lowercase)
  const normalizedQuery = query.trim().toLowerCase();
  
  // Find exact match first
  const exactMatch = demoQueries.find(dq => 
    dq.query.toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, try fuzzy matching based on key phrases
  const fuzzyMatch = demoQueries.find(dq => {
    const demoQueryNormalized = dq.query.toLowerCase();
    
    // Extract key phrases from both queries
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 3);
    const demoWords = demoQueryNormalized.split(' ').filter(word => word.length > 3);
    
    // Calculate similarity score
    let matchCount = 0;
    queryWords.forEach(word => {
      if (demoWords.some(demoWord => demoWord.includes(word) || word.includes(demoWord))) {
        matchCount++;
      }
    });
    
    // Return true if more than 60% of significant words match
    return (matchCount / queryWords.length) > 0.6;
  });
  
  return fuzzyMatch || null;
};

export const getAllDemoQueries = (): DemoQuery[] => {
  return demoQueries;
};

export const getDemoQueriesByCategory = (category: string): DemoQuery[] => {
  return demoQueries.filter(dq => 
    dq.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getDemoQueriesByProtocol = (protocol: string): DemoQuery[] => {
  return demoQueries.filter(dq => 
    dq.protocols.some(p => p.toLowerCase().includes(protocol.toLowerCase()))
  );
}; 