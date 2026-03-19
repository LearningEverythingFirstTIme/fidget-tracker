'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-charcoal bg-charcoal mb-6" style={{ boxShadow: '6px 6px 0px var(--charcoal)' }}>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>F</span>
          </div>
          <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--charcoal)' }}>
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Sign in to access your collection
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white border-3 border-charcoal p-8",
                headerTitle: "font-display text-xl",
                headerSubtitle: "text-sm",
                formButtonPrimary: "btn btn-primary w-full",
                formFieldInput: "w-full",
                footerAction: "text-sm",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
