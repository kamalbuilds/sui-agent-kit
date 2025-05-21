import { RobotChat } from "@/components/robot-chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto p-4 h-screen">
        <div className="flex flex-col h-full">
          <header className="py-4 text-center">
            <h1 className="text-3xl font-bold text-white">SUI Blockchain Assistant</h1>
            <p className="text-slate-400 mt-2">Chat with our 3D robot assistant about SUI blockchain</p>
          </header>
          
          <div className="flex-grow">
            <RobotChat />
          </div>
          
          <footer className="py-4 text-center text-slate-500 text-sm">
            © 2025 SUI Blockchain Assistant. Built with Next.js, Shadcn UI and Spline 3D.
          </footer>
        </div>
      </div>
    </main>
  );
}
