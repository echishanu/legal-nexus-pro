
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sun, Moon, Laptop } from 'lucide-react';

const AppearanceSettings = () => {
  const [theme, setTheme] = React.useState<string>("system");
  const [fontSize, setFontSize] = React.useState<string>("medium");
  
  const saveAppearanceSettings = () => {
    // In a real app, this would save the appearance settings
    console.log('Theme:', theme);
    console.log('Font size:', fontSize);
    toast.success('Appearance settings saved');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize the look and feel of the application.
        </p>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base">Theme</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the theme for the application interface
            </p>
            
            <ToggleGroup 
              type="single" 
              value={theme} 
              onValueChange={(value) => value && setTheme(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="light" className="flex gap-2 items-center">
                <Sun size={16} />
                <span>Light</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" className="flex gap-2 items-center">
                <Moon size={16} />
                <span>Dark</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="system" className="flex gap-2 items-center">
                <Laptop size={16} />
                <span>System</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="pt-6 border-t">
            <Label className="text-base">Font Size</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Adjust the font size for better readability
            </p>
            
            <ToggleGroup 
              type="single" 
              value={fontSize} 
              onValueChange={(value) => value && setFontSize(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="small">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="pt-6 border-t">
            <Label className="text-base">Layout Density</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Adjust the density of the interface elements
            </p>
            
            <ToggleGroup 
              type="single" 
              defaultValue="comfortable" 
              className="justify-start"
            >
              <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
              <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
              <ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={saveAppearanceSettings}>
            Save Appearance Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
