import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ChevronLeft, Terminal } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--background-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <span className="text-sm font-bold">FT</span>
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
                FIDGET://TRACKER
              </h1>
            </div>
          </Link>
          <Link href="/" className="btn btn-secondary text-xs px-3 py-2">
            <ChevronLeft className="h-4 w-4" />
            BACK
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 mb-4 animate-flicker" style={{ borderColor: 'var(--accent)' }}>
              <Terminal className="h-8 w-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--foreground)' }}>
              NEW_OPERATOR
            </h2>
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>
              Create your access credentials
            </p>
          </div>
          
          <div className="card p-0 overflow-hidden">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none",
                  header: "hidden",
                  socialButtonsBlockButton: "w-full",
                  dividerLine: "bg-zinc-700",
                  dividerText: "text-zinc-500 text-xs uppercase tracking-wider",
                  formFieldLabel: "text-xs uppercase tracking-wider text-zinc-400",
                  formButtonPrimary: "w-full",
                  footerActionLink: "text-cyan-400 hover:text-cyan-300",
                },
              }}
            />
          </div>
          
          <p className="text-center text-xs uppercase tracking-widest mt-6" style={{ color: 'var(--foreground-dim)' }}>
            REGISTRATION_INITIATES_SESSION_ACCESS
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--foreground-dim)' }}>
          FIDGET://TRACKER — System v2.0
        </p>
      </footer>
    </div>
  );
}
