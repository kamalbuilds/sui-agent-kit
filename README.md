# SUI AI Agent 

![SUI AI gent](https://sui.io/img/sui-logo.svg)

A powerful AI-powered agent for interacting with the SUI blockchain. This project consists of two main components:

1. **@0xkamal7/sui-agent**: A TypeScript package that interfaces with the SUI blockchain
2. **Frontend UI**: A Next.js application providing a conversational interface to the agent

## Features

- **Natural Language Processing**: Interact with SUI blockchain using natural language
- **Wallet Integration**: Connect your SUI wallet for transactions
- **Transaction Support**: Execute various blockchain operations through conversation
- **3D Robot Interface**: Engaging UI with interactive 3D robot avatar
- **Multi-protocol Support**: Integrated with various SUI protocols:
  - SuiLend
  - Cetus
  - Aftermath
  - Bluefin
  - Navi

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- SUI wallet

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/kamalbuilds/sui-agent.git
cd sui-agent

# Install dependencies for the agent package
cd sui-agent
npm install

# Build the agent package
npm run build

# Install dependencies for the frontend
cd ../frontend
npm install
```

### Environment Setup

Create a `.env` file in the `frontend` directory:

```
NEXT_PUBLIC_ATOMA_API_KEY=your_atoma_api_key
NEXT_PUBLIC_MODEL_NAME=Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic
```

### Running the Application

```bash
# Start the frontend development server
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the SUI Agent interface.

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the top right
2. **Ask Questions**: Type your queries about SUI blockchain in the chat
3. **Execute Transactions**: Ask the agent to perform transactions for you
4. **View Results**: See transaction results and blockchain data in the chat

### Example Queries

- "What is the current price of SUI token?"
- "Show me the top 5 pools by TVL"
- "Lend 0.0001 SUI on SUILEND"
- "What are the top DeFi protocols on SUI?"

## Architecture

### SUI Agent Package

The SUI agent uses a pipeline architecture:

1. **Query Decomposition**: Breaks complex queries into subqueries
2. **Tool Selection**: Identifies appropriate tools for each subquery
3. **Query Processing**: Executes tools and aggregates results

### Frontend

- Built with Next.js, TypeScript, and Tailwind CSS
- Uses Shadcn UI components
- Integrates with the SUI Agent via API routes
- Features a 3D robot interface using Spline

## Troubleshooting

### Common Issues

- **Connection Problems**: Ensure you have a valid SUI wallet and correct network selected
- **Transaction Failures**: Check that you have sufficient funds and correct permissions
- **Loading Errors**: Verify your API keys are set correctly

### Debugging

The application includes detailed logging. Check browser console and server logs for issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- SUI Foundation for blockchain infrastructure
- Atoma AI for language model capabilities
- All contributors to the various integrated protocols

