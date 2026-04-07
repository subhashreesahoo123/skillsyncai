'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { FileText, History, Loader2, User, CreditCard, Info } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser } from '@/firebase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/history')) return 'History';
    if (pathname.startsWith('/profile')) return 'Profile & Analytics';
    if (pathname.startsWith('/pricing')) return 'Subscription';
    if (pathname.startsWith('/about')) return 'About Us';
    return 'SkillSync AI';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard')}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <FileText />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/history')}
                tooltip="History"
              >
                <Link href="/history">
                  <History />
                  <span>History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/pricing')}
                tooltip="Subscription"
              >
                <Link href="/pricing">
                  <CreditCard />
                  <span>Subscription</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/about')}
                tooltip="About"
              >
                <Link href="/about">
                  <Info />
                  <span>About</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/profile')}
                tooltip="Profile"
              >
                <Link href="/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="glow-effect top-[-20%] left-[-10%] h-3/5 w-3/5 bg-primary/20" />
          <div className="glow-effect bottom-[-20%] right-[-10%] h-3/5 w-3/5 bg-blue-500/20" />
        </div>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="font-headline text-lg font-semibold md:text-xl">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 animate-fade-in-up overflow-y-auto p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
