
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Zap, 
  Library, 
  BarChart3, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Home', icon: Home, url: '/' },
  { title: 'Chat', icon: MessageSquare, url: '/chat' },
  { title: 'Summarizer', icon: FileText, url: '/summarizer' },
  { title: 'Content Studio', icon: Zap, url: '/content-studio' },
  { title: 'Prompt Library', icon: Library, url: '/prompt-library' },
  { title: 'Analytics', icon: BarChart3, url: '/analytics' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-card/50 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3 w-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className={cn(
            "font-bold text-lg tracking-tight transition-opacity duration-300 whitespace-nowrap",
            state === "collapsed" ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            Fortuna AI
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-colors h-10 px-3",
                  pathname === item.url && "bg-primary/10 text-primary"
                )}
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3",
          state === "collapsed" ? "justify-center" : "px-2"
        )}>
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              G
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex-1 min-w-0 transition-opacity duration-300",
            state === "collapsed" ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            <p className="text-sm font-medium truncate">Guest Explorer</p>
            <p className="text-xs text-muted-foreground truncate">fortuna-ai-demo</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
