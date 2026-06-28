'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Copy, Library, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { improvePrompt } from '@/ai/flows/improve-prompt-flow';

const promptCategories = [
  {
    title: 'Question Answering',
    prompts: [
      { title: 'Explain Complex Topics', text: 'Explain the concept of quantum entanglement to a 10-year-old using simple analogies.' },
      { title: 'Socratic Tutor', text: 'Act as a Socratic tutor. Guide me through solving a calculus problem without giving the answer directly.' },
      { title: 'Analytic Breakdown', text: 'Provide a SWOT analysis for a new electric vehicle startup in the European market.' },
    ]
  },
  {
    title: 'Summarization',
    prompts: [
      { title: 'Actionable Takeaways', text: 'Summarize the attached meeting notes into 3 clear action items and a summary of decisions made.' },
      { title: 'Executive Summary', text: 'Rewrite this 10-page report into a 250-word executive summary for a CEO.' },
      { title: 'ELI5 Summary', text: 'Summarize this technical research paper so that someone with no scientific background can understand it.' },
    ]
  },
  {
    title: 'Creative Writing',
    prompts: [
      { title: 'Character Building', text: 'Write a character profile for a detective in a cyberpunk world who has lost their memory.' },
      { title: 'World Building', text: 'Describe a floating city in a post-apocalyptic world where water is the primary currency.' },
      { title: 'Marketing Hook', text: 'Write 5 compelling hook sentences for a LinkedIn post about AI productivity tools.' },
    ]
  }
];

export default function PromptLibraryPage() {
  const [search, setSearch] = useState('');
  const [improveInput, setImproveInput] = useState('');
  const [improvedResult, setImprovedResult] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const handleImprove = async () => {
    if (!improveInput.trim()) return;
    setIsImproving(true);
    try {
      const result = await improvePrompt({ prompt: improveInput });
      setImprovedResult(result);
    } catch (error) {
      toast({ variant: 'destructive', description: 'Failed to improve prompt.' });
    } finally {
      setIsImproving(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: 'Prompt copied to library' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Prompt Engineering Library</h1>
        <p className="text-muted-foreground">Master the art of AI communication with professional prompt templates.</p>
      </div>

      {/* Prompt Improver Tool */}
      <Card className="p-8 border-primary/20 bg-primary/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wand2 className="h-32 w-32 -rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Prompt Optimizer
            </h2>
            <p className="text-sm text-muted-foreground">Turn simple requests into high-performance professional prompts.</p>
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. Explain AI" 
              className="bg-background border-white/10"
              value={improveInput}
              onChange={(e) => setImproveInput(e.target.value)}
            />
            <Button onClick={handleImprove} disabled={!improveInput.trim() || isImproving}>
              {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Optimize'}
            </Button>
          </div>

          {improvedResult && (
            <div className="p-4 rounded-xl bg-background border border-primary/20 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Optimized Result</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyPrompt(improvedResult)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm italic leading-relaxed text-foreground">{improvedResult}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Library Grid */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-secondary" />
            <h2 className="text-xl font-bold">Curated Templates</h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              className="pl-10 bg-white/5 border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promptCategories.map((cat) => (
            <div key={cat.title} className="space-y-4">
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 h-7 px-4">
                {cat.title}
              </Badge>
              <div className="space-y-4">
                {cat.prompts
                  .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase()))
                  .map((p) => (
                    <Card key={p.title} className="p-5 glass-card border-white/10 hover:border-primary/30 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{p.title}</h4>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyPrompt(p.text)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {p.text}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
