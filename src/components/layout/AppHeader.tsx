import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <AppLogo size="sm" />
      </div>
      <div className="flex-1">
        {/* Placeholder for search or other header items */}
      </div>
      <div>
        {/* Placeholder for user menu or actions */}
      </div>
    </header>
  );
}
