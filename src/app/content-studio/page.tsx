'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Zap, Loader2, Sparkles, Copy, Book, FileText, Mail, Share2, PenTool, Square } from 'lucide-react';
import { generateContent } from '@/ai/flows/content-flow';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const templates = [
  { id: 'story', title: 'Story Generator', icon: Book, desc: 'Creative fictional stories.' },
  { id: 'essay', title: 'Essay Assistant', icon: FileText, desc: 'Academic and formal essays.' },
  { id: 'email', title: 'Professional Email', icon: Mail, desc: 'Business communications.' },
  { id: 'linkedin', title: 'LinkedIn Post', icon: Share2, desc: 'Engaging social content.' },
  { id: 'poem', title: 'Poetry Studio', icon: PenTool, desc: 'Creative and rhythmic verse.' },
];

export default function ContentStudioPage() {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<boolean>(false);
  const { toast } = useToast();
  const db = useFirestore();

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsLoading(false);
    toast({ description: "Content generation stopped." });
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    abortControllerRef.current = false;
    try {
      const result = await generateContent({ 
        type: activeTemplate.id as any,
        topic,
        instructions
      });

      if (abortControllerRef.current) return;

      setOutput(result);

      // Save to Firestore
      addDoc(collection(db, 'generatedContent'), {
        userId: 'guest-user',
        type: activeTemplate.id,
        input: topic,
        output: result,
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      if (abortControllerRef.current) return;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate content.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
        <p className="text-muted-foreground">Professional AI writing tools for every occasion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Templates Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Templates</label>
          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  activeTemplate.id === t.id 
                  ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground'
                }`}
                disabled={isLoading}
              >
                <t.icon className="h-5 w-5 mb-2" />
                <h3 className="font-bold text-sm">{t.title}</h3>
                <p className="text-[10px] opacity-70">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Output */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 glass-card border-white/10 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What should I write about?</label>
                <Input 
                  placeholder={`Enter your ${activeTemplate.id} topic...`} 
                  className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Any specific instructions? (Optional)</label>
                <Textarea 
                  placeholder="e.g. Tone should be humorous, include a call to action..." 
                  className="bg-white/5 border-white/10 min-h-[100px] resize-none"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {isLoading ? (
                <Button 
                  variant="destructive"
                  className="w-full h-12" 
                  onClick={handleStop}
                >
                  <Square className="h-5 w-5 fill-current mr-2" />
                  Stop Generation
                </Button>
              ) : (
                <Button 
                  className="w-full h-12" 
                  onClick={handleGenerate} 
                  disabled={!topic.trim()}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate {activeTemplate.title}
                </Button>
              )}
            </Card>

            <Card className="p-8 glass-card border-white/10 min-h-[400px] relative">
              <div className="absolute right-4 top-4">
                {output && !isLoading && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast({ description: 'Copied to clipboard' });
                  }}>
                    <Copy className="h-4 w-4 mr-2" /> Copy Result
                  </Button>
                )}
              </div>
              
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="animate-pulse">Fortuna AI is crafting your content...</p>
                </div>
              ) : output ? (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-lg">{output}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground text-center py-20 opacity-30">
                  <Zap className="h-16 w-16" />
                  <p className="text-lg">Your generated masterpiece will appear here.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
