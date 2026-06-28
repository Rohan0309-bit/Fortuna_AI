
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings as SettingsIcon, 
  Trash2, 
  Shield, 
  Monitor, 
  Moon, 
  Sun,
  LogOut,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  const handleClearData = () => {
    toast({
      variant: 'destructive',
      title: 'Action blocked',
      description: 'In guest mode, data is cleared automatically when the project environment resets.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace preferences and account details.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Account Information */}
        <Card className="p-6 glass-card border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <User className="h-5 w-5 text-primary" />
            Account Information
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border border-primary/30">
              G
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-xl font-bold">Guest Explorer</h3>
              <p className="text-sm text-muted-foreground">fortuna-ai-demo@guest.local</p>
              <div className="pt-2">
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                  Premium Plan
                </span>
              </div>
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Upgrade Account
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 glass-card border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Monitor className="h-5 w-5 text-secondary" />
            Preferences
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Optimize interface for low-light environments.</p>
              </div>
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts about your AI generations.</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Security & Data */}
        <Card className="p-6 glass-card border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Shield className="h-5 w-5 text-accent" />
            Security & Privacy
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your activity history and files.</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="shrink-0"
                onClick={handleClearData}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear History
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-8">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sign out of all sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
