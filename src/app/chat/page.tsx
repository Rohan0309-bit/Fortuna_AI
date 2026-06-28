'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Copy, ThumbsUp, ThumbsDown, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/ai/flows/chat-flow';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  firestoreId?: string;
  feedback?: 'helpful' | 'not-helpful' | null;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Fortuna AI assistant. How can I help you think faster and create smarter today?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleFeedback = async (messageFirestoreId: string | undefined, messageId: string, type: 'helpful' | 'not-helpful') => {
    if (!chatId || !messageFirestoreId) {
      toast({ description: "Cannot save feedback for this message yet." });
      return;
    }

    try {
      const messageRef = doc(db, 'chats', chatId, 'messages', messageFirestoreId);
      updateDoc(messageRef, { feedback: type });
      
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, feedback: type } : m
      ));

      toast({ 
        description: type === 'helpful' ? "Glad you found this helpful!" : "Thanks for the feedback, we'll improve.",
        duration: 2000 
      });
    } catch (e) {
      console.error('Feedback Error:', e);
    }
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsTyping(false);
    toast({ description: "Generation stopped." });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    abortControllerRef.current = false;
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      const responseText = await generateChatResponse({
        history,
        message: input
      });

      if (abortControllerRef.current) return;

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Persistence
      let currentChatId = chatId;
      if (!currentChatId) {
        const chatDoc = await addDoc(collection(db, 'chats'), {
          userId: 'guest-user',
          title: input.slice(0, 40) + (input.length > 40 ? '...' : ''),
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
        });
        currentChatId = chatDoc.id;
        setChatId(currentChatId);
      } else {
        updateDoc(doc(db, 'chats', currentChatId), {
          lastMessageAt: serverTimestamp()
        });
      }

      addDoc(collection(db, 'chats', currentChatId, 'messages'), {
        role: 'user',
        content: input,
        timestamp: serverTimestamp(),
      });

      const aiMsgDoc = await addDoc(collection(db, 'chats', currentChatId, 'messages'), {
        role: 'assistant',
        content: responseText,
        timestamp: serverTimestamp(),
        feedback: null
      });

      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, firestoreId: aiMsgDoc.id } : m
      ));

    } catch (error) {
      if (abortControllerRef.current) return;
      console.error('Chat Interaction Error:', error);
      toast({
        variant: 'destructive',
        title: 'Intelligence Offline',
        description: error instanceof Error ? error.message : 'Unable to reach the AI core.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative max-w-5xl mx-auto w-full">
      <div className="absolute inset-0 hero-gradient pointer-events-none opacity-50" />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 relative z-10 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg",
              msg.role === 'user' ? "bg-primary text-white" : "bg-secondary text-white"
            )}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className={cn(
              "flex flex-col max-w-[85%] gap-2",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "glass-card text-foreground rounded-tl-none border border-white/10"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              
              <div className="flex items-center gap-4 px-1 text-muted-foreground">
                <button 
                  onClick={() => copyToClipboard(msg.content)} 
                  className="hover:text-foreground transition-colors p-1"
                  title="Copy to clipboard"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {msg.role === 'assistant' && msg.id !== '1' && (
                  <>
                    <button 
                      className={cn(
                        "hover:text-primary transition-colors p-1",
                        msg.feedback === 'helpful' && "text-primary"
                      )}
                      onClick={() => handleFeedback(msg.firestoreId, msg.id, 'helpful')}
                      title="Helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      className={cn(
                        "hover:text-destructive transition-colors p-1",
                        msg.feedback === 'not-helpful' && "text-destructive"
                      )}
                      onClick={() => handleFeedback(msg.firestoreId, msg.id, 'not-helpful')}
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-4 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white shadow-lg">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-card p-4 rounded-2xl rounded-tl-none border border-white/10">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-gradient-to-t from-background via-background to-transparent relative z-10">
        <div className="relative max-w-3xl mx-auto">
          <Input 
            placeholder="Type your message..." 
            className="h-14 pl-6 pr-24 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/50 text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            {isTyping ? (
              <Button 
                size="icon" 
                variant="destructive"
                className="h-10 w-10 rounded-xl shadow-lg animate-in fade-in scale-in"
                onClick={handleStop}
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            ) : (
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-bold opacity-30">
          Powered by Fortuna AI • Premium Assistant
        </p>
      </div>
    </div>
  );
}
