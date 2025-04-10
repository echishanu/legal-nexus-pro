
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = React.useState({
    caseUpdates: true,
    documentUploads: true,
    billingAlerts: true,
    taskReminders: false,
    marketingEmails: false,
  });
  
  const [appNotifications, setAppNotifications] = React.useState({
    caseUpdates: true,
    documentUploads: true,
    billingAlerts: true,
    taskReminders: true,
    mentions: true,
  });
  
  const handleEmailChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleAppChange = (key: keyof typeof appNotifications) => {
    setAppNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const saveNotificationSettings = () => {
    // In a real app, this would save the notification settings
    console.log('Email notifications:', emailNotifications);
    console.log('App notifications:', appNotifications);
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Configure how you want to be notified about activity in your account.
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-case-updates">Case updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when cases are updated
                  </p>
                </div>
                <Switch
                  id="email-case-updates"
                  checked={emailNotifications.caseUpdates}
                  onCheckedChange={() => handleEmailChange('caseUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-document-uploads">Document uploads</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when documents are uploaded
                  </p>
                </div>
                <Switch
                  id="email-document-uploads"
                  checked={emailNotifications.documentUploads}
                  onCheckedChange={() => handleEmailChange('documentUploads')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-billing-alerts">Billing alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about billing and invoices
                  </p>
                </div>
                <Switch
                  id="email-billing-alerts"
                  checked={emailNotifications.billingAlerts}
                  onCheckedChange={() => handleEmailChange('billingAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-task-reminders">Task reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email reminders about upcoming tasks
                  </p>
                </div>
                <Switch
                  id="email-task-reminders"
                  checked={emailNotifications.taskReminders}
                  onCheckedChange={() => handleEmailChange('taskReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-marketing">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch
                  id="email-marketing"
                  checked={emailNotifications.marketingEmails}
                  onCheckedChange={() => handleEmailChange('marketingEmails')}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-case-updates">Case updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications when cases are updated
                  </p>
                </div>
                <Switch
                  id="app-case-updates"
                  checked={appNotifications.caseUpdates}
                  onCheckedChange={() => handleAppChange('caseUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-document-uploads">Document uploads</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications when documents are uploaded
                  </p>
                </div>
                <Switch
                  id="app-document-uploads"
                  checked={appNotifications.documentUploads}
                  onCheckedChange={() => handleAppChange('documentUploads')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-billing-alerts">Billing alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications about billing and invoices
                  </p>
                </div>
                <Switch
                  id="app-billing-alerts"
                  checked={appNotifications.billingAlerts}
                  onCheckedChange={() => handleAppChange('billingAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-task-reminders">Task reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications about upcoming tasks
                  </p>
                </div>
                <Switch
                  id="app-task-reminders"
                  checked={appNotifications.taskReminders}
                  onCheckedChange={() => handleAppChange('taskReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-mentions">Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications when you're mentioned in comments
                  </p>
                </div>
                <Switch
                  id="app-mentions"
                  checked={appNotifications.mentions}
                  onCheckedChange={() => handleAppChange('mentions')}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={saveNotificationSettings}>
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
