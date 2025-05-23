# Demo Queries Integration for SUI AI Agent Kit

This document explains how the demo queries feature works in the SUI AI Agent Kit frontend, allowing users to experience realistic DeFi scenarios without executing real transactions.

## 🎯 Overview

The demo queries feature provides pre-defined, realistic responses to complex DeFi queries, showcasing the capabilities of the SUI AI Agent across multiple protocols including:

- **Aftermath Finance** (Liquid Staking)
- **Cetus Protocol** (DEX & Liquidity)
- **Navi Protocol** (Lending)
- **Bluefin Exchange** (Perpetuals)
- **Suilend Protocol** (Institutional DeFi)
- **Cross-Protocol Strategies**

## 📁 File Structure

```
sui-agent/frontend/
├── lib/
│   └── demo-queries.ts          # Demo query definitions and matching logic
├── app/api/sui-agent/
│   └── route.ts                 # API route with demo query handling
├── components/
│   ├── robot-chat.tsx           # Main chat interface with demo integration
│   └── ui/
│       ├── example-prompts.tsx  # Demo query showcase component
│       └── badge.tsx            # UI component for categories
└── DEMO_QUERIES_README.md       # This documentation
```

## 🚀 Features

### 1. **6 Comprehensive Demo Scenarios**

1. **Cross-Protocol Yield Farming** - Multi-step yield optimization across Aftermath and Cetus
2. **Advanced Lending Strategy** - Leveraged position using Navi Protocol and liquid staking
3. **Perpetual Trading with Risk Management** - Complex trading strategy on Bluefin with hedging
4. **Cross-Protocol Arbitrage & Portfolio Optimization** - Arbitrage execution and rebalancing
5. **Institutional DeFi Strategy** - Enterprise-grade lending with compliance considerations
6. **Multi-Protocol Governance & Social Trading** - Automated governance and copy trading

### 2. **Smart Query Matching**

- **Exact Match**: Perfect string matching for precise demo responses
- **Fuzzy Match**: Semantic matching based on key phrases (60% similarity threshold)
- **Fallback**: Regular agent processing if no demo match found

### 3. **Rich Response Format**

Each demo response includes:
- Detailed step-by-step execution
- Realistic transaction hashes
- Gas usage estimates
- Execution time metrics
- Protocol-specific information
- Risk analysis and recommendations

## 🔧 Implementation Details

### Demo Query Structure

```typescript
interface DemoQuery {
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
```

### API Integration

The API route (`/api/sui-agent/route.ts`) checks for demo queries before processing with the actual agent:

```typescript
// Check for demo query matches first
const demoQuery = findDemoQuery(query);
if (demoQuery) {
  return NextResponse.json(handleDemoQueryRequest(query, senderAddress));
}

// Fallback to regular agent processing
const result = await safelyProcessResponse(agent, query, senderAddress);
```

### Frontend Integration

The chat interface automatically displays demo queries when there are minimal messages:

```typescript
{messages.length <= 1 && (
  <div className="mt-4">
    <ExamplePrompts 
      onPromptSelect={handlePromptSelect}
      isConnected={isConnected}
    />
  </div>
)}
```

## 🎨 UI Components

### ExamplePrompts Component

- **Grid Layout**: Responsive 1-3 column grid
- **Category Icons**: Visual indicators for different DeFi strategies
- **Protocol Badges**: Shows involved protocols
- **Performance Metrics**: Execution time and gas usage preview
- **Interactive Cards**: Click to populate chat input

### Enhanced Chat Display

- **Demo Response Highlighting**: Special styling for demo query responses
- **Transaction Hash Display**: Formatted list of realistic transaction IDs
- **Category Information**: Shows strategy type and protocols used
- **Performance Metrics**: Execution time and gas usage in chat

## 🧪 Testing

### Manual Testing

1. **Connect Wallet**: Ensure wallet is connected to see demo queries
2. **Click Demo Cards**: Select any demo query from the showcase
3. **Verify Response**: Check that the pre-defined response is returned
4. **Check Formatting**: Ensure transaction details are properly displayed

### Automated Testing

Run the test script to verify query matching:

```bash
cd sui-agent/frontend
node test-demo-queries.js
```

## 📝 Adding New Demo Queries

To add a new demo query:

1. **Add to `demo-queries.ts`**:
```typescript
{
  id: 7,
  category: "New Strategy Category",
  protocols: ["Protocol1", "Protocol2"],
  query: "Your detailed query here...",
  aiResponse: {
    status: "success",
    message: "Detailed response with markdown formatting...",
    executionTime: "X.X seconds",
    gasUsed: "0.00XX SUI",
    transactionHashes: ["hash1", "hash2", "hash3"]
  }
}
```

2. **Update Category Icons** (if needed):
```typescript
const getCategoryIcon = (category: string) => {
  if (category.toLowerCase().includes('newtype')) return <NewIcon className="h-4 w-4" />;
  // ... existing categories
};
```

3. **Test the Integration**:
- Verify exact query matching
- Check response formatting
- Test UI display

## 🎯 Best Practices

### Query Design
- **Be Specific**: Include exact protocol names and amounts
- **Multi-Step**: Show complex, realistic DeFi workflows
- **Educational**: Explain strategy benefits and risks

### Response Format
- **Use Emojis**: Visual indicators for different sections
- **Markdown Formatting**: Bold headers, bullet points, code blocks
- **Realistic Data**: Actual-looking transaction hashes and metrics
- **Educational Content**: Explain strategies and provide insights

### UI/UX
- **Progressive Disclosure**: Show summary first, details on interaction
- **Visual Hierarchy**: Use colors and icons to categorize
- **Responsive Design**: Ensure mobile compatibility
- **Loading States**: Smooth transitions between states

## 🔒 Security Considerations

- **No Real Transactions**: Demo mode never executes actual blockchain transactions
- **Safe Hashes**: All transaction hashes are fictional and safe
- **Wallet Safety**: Demo queries don't access or modify wallet state
- **Clear Indicators**: Users always know they're in demo mode

## 🚀 Future Enhancements

1. **Dynamic Demo Data**: Real-time protocol data for more realistic responses
2. **Custom Demo Builder**: Allow users to create their own demo scenarios
3. **Interactive Tutorials**: Step-by-step guided experiences
4. **Performance Analytics**: Track which demos are most popular
5. **Multi-Language Support**: Localized demo queries and responses

## 📊 Analytics & Monitoring

Track demo query usage:
- Most popular demo categories
- User engagement with different strategies
- Conversion from demo to real usage
- Performance metrics and load times

---

**Note**: This demo system is designed for educational and demonstration purposes. Always verify strategies and conduct your own research before executing real DeFi transactions. 