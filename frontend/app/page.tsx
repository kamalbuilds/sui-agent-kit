import nextDynamic from 'next/dynamic';

// Dynamically import RobotChat with no SSR to prevent hydration issues
const RobotChat = nextDynamic(() => import("@/components/robot-chat").then(mod => ({ default: mod.RobotChat })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-sm">Loading SUI Assistant...</span>
      </div>
    </div>
  )
});

// Force dynamic rendering to avoid static generation issues with SUI agent
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <header className="py-4 text-center flex-shrink-0">
          <h1 className="text-3xl font-bold text-white">SUI Blockchain Assistant</h1>
          <p className="text-slate-400 mt-2">Chat with our 3D robot assistant about SUI blockchain</p>
        </header>
        
        <div className="flex-grow min-h-0">
          <RobotChat />
        </div>
        
        {/* <footer className="py-2 text-center text-slate-500 text-sm flex-shrink-0">
          © 2025 SUI Blockchain Assistant. Built with Next.js, Shadcn UI and Spline 3D.
        </footer> */}
      </div>
    </main>
  );
}
