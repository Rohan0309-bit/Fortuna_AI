
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden bg-background">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-4 bg-background/50 backdrop-blur-md sticky top-0 z-30">
            <SidebarTrigger />
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex-1">
              <h2 className="text-sm font-medium text-muted-foreground">Fortuna AI Workspace</h2>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
