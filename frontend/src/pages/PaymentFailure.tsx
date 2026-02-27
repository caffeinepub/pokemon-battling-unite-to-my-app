import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Glow card */}
        <div
          className="relative rounded-3xl border p-8 md:p-10 overflow-hidden"
          style={{
            background: 'rgba(239,68,68,0.06)',
            borderColor: 'rgba(239,68,68,0.35)',
            boxShadow: '0 0 40px rgba(239,68,68,0.15)',
          }}
        >
          {/* Top glow bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: 'rgba(239,68,68,0.6)' }}
            aria-hidden="true"
          />

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '2px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 20px rgba(239,68,68,0.2)',
              }}
            >
              <XCircle size={40} className="text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-black text-red-400 mb-2 tracking-wider"
            style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.08em' }}
          >
            PAYMENT CANCELLED
          </h1>

          {/* Emoji */}
          <div className="text-4xl mb-4">😔</div>

          <p className="text-sm text-muted-foreground mb-2">
            Your payment was not completed. No charges were made.
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            You can try again whenever you're ready. Your ninja monsters are waiting to evolve!
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'rgba(168,85,247,0.15)',
                border: '1.5px solid rgba(168,85,247,0.4)',
                color: '#c084fc',
                boxShadow: '0 0 10px rgba(168,85,247,0.15)',
              }}
            >
              💎 Try Again
            </button>
            <button
              onClick={() => navigate({ to: '/game' })}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all active:scale-95"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
