'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Copy, Trash2, Loader2, Sparkles, Square } from 'lucide-react';
import { summarizeText } from '@/ai/flows/summarize-flow';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SummarizerPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'quick' | 'detailed' | 'bullets'>('quick');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<boolean>(false);
  const { toast } = useToast();
  const db = useFirestore();

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsLoading(false);
    toast({ description: "Summarization stopped." });
  };

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    abortControllerRef.current = false;
    try {
      const result = await summarizeText({ text: input, mode });
      
      if (abortControllerRef.current) return;

      setOutput(result.summary);

      // Save to Firestore
      addDoc(collection(db, 'summaries'), {
        userId: 'guest-user',
        originalText: input,
        summary: result.summary,
        mode,
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      if (abortControllerRef.current) return;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ description: 'Copied to clipboard' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Smart Summarizer</h1>
        <p className="text-muted-foreground">Turn long documents into actionable insights instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Source Text</label>
            <Button variant="ghost" size="sm" onClick={() => setInput('')}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
          <Textarea 
            placeholder="Paste your long text here..." 
            className="min-h-[400px] resize-none bg-white/5 border-white/10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="space-y-4">
            <label className="text-sm font-medium">Summary Mode</label>
            <Tabs defaultValue="quick" onValueChange={(v) => setMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="quick">Quick</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="bullets">Bullets</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <Button 
                variant="destructive"
                className="w-full h-12 text-lg" 
                onClick={handleStop}
              >
                <Square className="h-5 w-5 mr-2 fill-current" />
                Stop Generation
              </Button>
            ) : (
              <Button 
                className="w-full h-12 text-lg" 
                onClick={handleSummarize} 
                disabled={!input.trim()}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Summary
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between h-8">
            <label className="text-sm font-medium">Result</label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            )}
          </div>
          <Card className="min-h-[500px] p-6 glass-card border-white/10 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="animate-pulse">Generating your summary...</p>
              </div>
            ) : output ? (
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{output}</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground text-center px-8">
                <FileText className="h-12 w-12 opacity-20" />
                <p>Your AI-generated summary will appear here. Select a mode and click generate.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
