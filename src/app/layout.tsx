import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Skill Ascent',
  description: 'Track your skills and ascend to new heights!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased font-sans")}>
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
        <Toaster />
      </body>
    </html>
  );
}
