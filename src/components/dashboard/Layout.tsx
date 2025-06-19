import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <main className="md:pl-64 min-h-screen">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}