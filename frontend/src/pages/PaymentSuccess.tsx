import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Glow card */}
        <div
          className="relative rounded-3xl border p-8 md:p-10 overflow-hidden"
          style={{
            background: 'rgba(34,197,94,0.06)',
            borderColor: 'rgba(34,197,94,0.35)',
            boxShadow: '0 0 40px rgba(34,197,94,0.2)',
          }}
        >
          {/* Top glow bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: 'rgba(34,197,94,0.6)' }}
            aria-hidden="true"
          />

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '2px solid rgba(34,197,94,0.4)',
                boxShadow: '0 0 20px rgba(34,197,94,0.3)',
              }}
            >
              <CheckCircle size={40} className="text-green-400" />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-black text-green-400 mb-2 tracking-wider"
            style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.08em' }}
          >
            PAYMENT SUCCESSFUL!
          </h1>

          {/* Crystal emoji */}
          <div className="text-4xl mb-4">💎</div>

          <p className="text-sm text-muted-foreground mb-2">
            Your Elemental Crystal has been added to your inventory.
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            Head to your Roster to use it and evolve your ninja monsters into their ultimate forms!
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate({ to: '/roster' })}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'rgba(34,197,94,0.2)',
                border: '1.5px solid rgba(34,197,94,0.5)',
                color: '#4ade80',
                boxShadow: '0 0 10px rgba(34,197,94,0.2)',
              }}
            >
              🥷 View Roster
            </button>
            <button
              onClick={() => navigate({ to: '/shop' })}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all active:scale-95"
            >
              💎 Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
