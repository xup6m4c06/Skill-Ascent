
import type { Metadata } from 'next';
// Removed Geist font imports
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';
import { NavMenu } from '@/components/layout/NavMenu';
import { AppHeader } from '@/components/layout/AppHeader';
import { cn } from '@/lib/utils';
import { AuthProviders } from '@/components/auth/AuthProviders';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Removed Geist font constant declarations

export const metadata: Metadata = {
  title: 'Skill Ascent',
  description: 'Track your skills and ascend to new heights!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-sans")}> {/* Removed Geist font variables from className */}
        <AuthProviders>
          <ThemeProvider>
            <SidebarProvider defaultOpen={true}>
              <Sidebar collapsible="icon" variant="sidebar" side="left">
                <SidebarHeader className="p-4">
                  <AppLogo />
                </SidebarHeader>
                <SidebarContent>
                  <NavMenu />
                </SidebarContent>
                <SidebarFooter className="p-4">
                  {/* Footer content if any */}
                </SidebarFooter>
                <SidebarRail />
              </Sidebar>
              <SidebarInset>
                <AppHeader />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
          <Toaster />
        </AuthProviders>
      </body>
    </html>
  );
}
