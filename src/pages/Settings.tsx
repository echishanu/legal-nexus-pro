
import React, { useState } from 'react';
import PageHeader from '@/components/UI/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProfileSettings from '@/components/Settings/ProfileSettings';
import SecuritySettings from '@/components/Settings/SecuritySettings';
import NotificationSettings from '@/components/Settings/NotificationSettings';
import AppearanceSettings from '@/components/Settings/AppearanceSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Settings" 
        description="Manage your account settings and preferences."
      />
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Settings;
