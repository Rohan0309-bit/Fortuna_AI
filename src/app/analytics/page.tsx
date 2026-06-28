
'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { MessageSquare, FileText, Zap, Star, Activity, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const db = useFirestore();

  const chatsQuery = useMemo(() => query(
    collection(db, 'chats'), 
    where('userId', '==', 'guest-user'),
    orderBy('createdAt', 'desc'),
    limit(10)
  ), [db]);

  const summariesQuery = useMemo(() => query(
    collection(db, 'summaries'), 
    where('userId', '==', 'guest-user')
  ), [db]);

  const contentQuery = useMemo(() => query(
    collection(db, 'generatedContent'), 
    where('userId', '==', 'guest-user')
  ), [db]);

  const { data: chats, loading: loadingChats } = useCollection(chatsQuery);
  const { data: summaries, loading: loadingSummaries } = useCollection(summariesQuery);
  const { data: contents, loading: loadingContents } = useCollection(contentQuery);

  const stats = [
    { label: 'Total Sessions', value: chats?.length || 0, icon: MessageSquare, color: 'text-primary' },
    { label: 'Summaries', value: summaries?.length || 0, icon: FileText, color: 'text-secondary' },
    { label: 'Studio Works', value: contents?.length || 0, icon: Zap, color: 'text-accent' },
    { label: 'AI Accuracy', value: '99.2%', icon: Star, color: 'text-yellow-500' },
  ];

  const chartData = [
    { name: 'Chats', count: chats?.length || 0, fill: '#7C3AED' },
    { name: 'Summaries', count: summaries?.length || 0, fill: '#06B6D4' },
    { name: 'Content', count: contents?.length || 0, fill: '#F59E0B' },
  ];

  const trendData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1100 },
  ];

  if (loadingChats || loadingSummaries || loadingContents) {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Premium insights into your AI productivity journey.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Activity className="h-3 w-3 text-green-500 animate-pulse" /> Live Status: Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 glass-card border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <stat.icon className="h-20 w-20" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-widest">
                +12% Trend
              </span>
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-3xl font-bold tracking-tight">{stat.value}</h2>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 glass-card border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Performance Distribution
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Usage</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#7C3AED" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 glass-card border-white/10 space-y-6 flex flex-col">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" /> Recent Activity
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {chats?.map((chat: any) => (
              <div key={chat.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{chat.title || 'Untitled Session'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Chat</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] text-muted-foreground">
                      {chat.createdAt?.toDate().toLocaleDateString() || 'Today'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {!chats?.length && (
              <div className="text-center py-20 text-muted-foreground text-sm italic opacity-30 flex flex-col items-center gap-4">
                <Activity className="h-12 w-12" />
                <p>No activity recorded yet.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
