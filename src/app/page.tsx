
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageSquare, Zap, FileText, Library, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Fortuna AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/prompt-library" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Library</Link>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/chat">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 hero-gradient pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles className="h-3 w-3" />
                <span>Next-Gen Intelligence is Here</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Think Faster. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Create Smarter.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                The AI-powered workspace for learning, summarization, creativity, and productivity. Built for the modern professional.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                <Button asChild size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 min-w-[200px]">
                  <Link href="/chat">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base border-white/10 hover:bg-white/5 min-w-[200px]">
                  <Link href="/chat">Try Live Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-surface/50 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Advanced AI Capabilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                One platform, endless possibilities. Everything you need to supercharge your workflow.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: MessageSquare, title: "Intelligent Chat", desc: "Real-time AI assistance for complex problem solving and learning." },
                { icon: FileText, title: "Smart Summarizer", desc: "Turn long documents into actionable insights in seconds." },
                { icon: Zap, title: "Content Studio", desc: "Generate professional emails, stories, and posts with ease." },
                { icon: Library, title: "Prompt Improver", desc: "Refine your AI inputs for better, more accurate results." },
                { icon: BarChart3, title: "Detailed Analytics", desc: "Track your productivity and AI usage with beautiful dashboards." },
                { icon: ShieldCheck, title: "Privacy First", desc: "Your data is encrypted and secure with enterprise-grade protection." },
              ].map((feature, i) => (
                <div key={i} className="glass-card p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Active Users", value: "50k+" },
                { label: "AI Generations", value: "2M+" },
                { label: "Happy Clients", value: "99%" },
                { label: "Server Uptime", value: "99.9%" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg tracking-tight">Fortuna AI</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-white">Privacy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-white">Terms</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-white">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fortuna AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
