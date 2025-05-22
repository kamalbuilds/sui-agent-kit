# SUI Agent Frontend

A responsive, mobile-friendly chat interface for the SUI Blockchain AI Agent. This frontend allows users to connect their SUI wallet and interact with the AI agent to perform blockchain transactions and get information about the SUI ecosystem.

## Features

- 🤖 AI-powered chat interface for the SUI blockchain
- 🔒 Secure wallet connection via private key
- 📱 Fully responsive design for mobile and desktop
- 🌐 3D animated robot using Spline
- ⚡ Real-time transaction processing and feedback

## Setup

### Prerequisites

- Node.js 16+ and npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```
3. Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_ATOMA_API_KEY=your_atoma_api_key
   NEXT_PUBLIC_MODEL_NAME=Infermatic/Llama-3.3-70B-Instruct-FP8-Dynamic
   ```

### Running the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Connect your SUI wallet by clicking the "Connect Wallet" button
2. Enter your SUI private key (starting with "suiprivkey")
3. Once connected, you can chat with the AI agent about SUI blockchain
4. Ask the agent to perform transactions, get information, or explain concepts

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Shadcn UI Components
- @0xkamal7/sui-agent
- Spline 3D
- @mysten/sui

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
