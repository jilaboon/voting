'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'ראשי' },
  { href: '/admin/costumes', label: 'תחפושות' },
  { href: '/admin/results', label: 'תוצאות' },
  { href: '/admin/settings', label: 'הגדרות' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <a
              href="/api/admin/logout"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              יציאה
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
