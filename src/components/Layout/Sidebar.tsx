
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  Building,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const { currentCompany } = useCompany();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard, 
      permission: null 
    },
    { 
      name: 'Cases', 
      path: '/cases', 
      icon: Briefcase, 
      permission: 'view:cases' 
    },
    { 
      name: 'Documents', 
      path: '/documents', 
      icon: FileText, 
      permission: 'view:documents' 
    },
    { 
      name: 'Clients', 
      path: '/clients', 
      icon: Users, 
      permission: 'view:clients' 
    },
    { 
      name: 'Calendar', 
      path: '/calendar', 
      icon: Calendar, 
      permission: 'view:events' 
    },
    { 
      name: 'Billing', 
      path: '/billing', 
      icon: DollarSign, 
      permission: 'view:invoices' 
    },
    { 
      name: 'Companies', 
      path: '/companies', 
      icon: Building, 
      permission: 'view:companies',
      adminOnly: true
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings, 
      permission: null 
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return !item.permission || hasPermission(item.permission);
  });

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col",
        "transition-all duration-300 ease-in-out border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-sidebar-border",
        collapsed && "justify-center"
      )}>
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <span className="text-accent-foreground font-bold">LN</span>
            </div>
            <h1 className="text-xl font-bold">LegalNexus</h1>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      {/* Company info */}
      {currentCompany && (
        <div className={cn(
          "px-4 py-3 border-b border-sidebar-border",
          collapsed && "text-center"
        )}>
          {!collapsed ? (
            <div className="text-sm">
              <p className="font-medium truncate">{currentCompany.name}</p>
            </div>
          ) : (
            <div className="h-6 w-6 mx-auto bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{currentCompany.name.charAt(0)}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "text-sidebar-foreground/80",
              collapsed && "justify-center"
            )}
          >
            <item.icon size={18} className={cn(!collapsed && "mr-3")} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        collapsed ? "text-center" : "flex items-center justify-between"
      )}>
        {!collapsed ? (
          <>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center mr-3">
                <span>{user?.name?.charAt(0)}</span>
              </div>
              <div className="text-sm">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sidebar-foreground/70 text-xs">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1 rounded-md hover:bg-sidebar-accent"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button 
            onClick={logout}
            className="p-1 mx-auto rounded-md hover:bg-sidebar-accent"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
