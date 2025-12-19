'use client';

import { type ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BotIcon,
  SettingsIcon,
  BookIcon,
  UsersIcon,
  User2Icon,
  UserCircle,
} from 'lucide-react';

type LayoutProps = {
  children: ReactNode;
};

const MenuOptions = [
  {
    title: 'Dashboard',
    url: '/#',
    icon: LayoutDashboard,
  },
  {
    title: 'Agents',
    url: '/#',
    icon: BotIcon,
  },
  {
    title: 'Settings',
    url: '/#',
    icon: SettingsIcon,
  },
  {
    title: 'Documentation',
    url: '/#',
    icon: BookIcon,
  },
  {
    title: 'Users',
    url: '/#',
    icon: UsersIcon,
  },
  {
    title: 'Profile',
    url: '/#',
    icon: User2Icon,
  },
];

function SidebarContentWithMenu() {
  const { open } = useSidebar();

  return (
    <>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild tooltip={menu.title}>
                    <a href={menu.url}>
                      <menu.icon />
                      {open && <span>{menu.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex justify-center items-center mb-10 ">
        <img src="/logo.svg" alt="FOBOH" className="h-8 w-auto" />
      </SidebarFooter>
    </>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarContentWithMenu />
        </Sidebar>

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-[#147D73] flex items-center justify-between">
            <SidebarTrigger className="text-white" />
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <UserCircle className="h-6 w-6 text-white hover:text-slate-700" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
