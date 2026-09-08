import { AuthGuard, FleetProvider } from '@/components/providers'
import { Header, MobileNav, PageTransition, Sidebar } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'

export default function ProtectedLayout({ children }: LayoutProps<'/'>) {
  return (
    <AuthGuard>
      <FleetProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <MobileNav />
            <main className="flex-1 p-4 md:p-6">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
        <Toaster />
      </FleetProvider>
    </AuthGuard>
  )
}
