import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useQueries';
import type { ShoppingItem } from '../backend';
import StripePaymentSetup from '../components/StripePaymentSetup';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface Crystal {
  id: string;
  name: string;
  emoji: string;
  element: string;
  description: string;
  priceUsd: number;
  priceInCents: number;
  glowColor: string;
  bgColor: string;
  borderColor: string;
}

const CRYSTALS: Crystal[] = [
  {
    id: 'flame',
    name: 'Flame Crystal',
    emoji: '🔥',
    element: 'Fire',
    description: 'Unlocks evolution for Fire-element ninja monsters. Harness the ancient flame arts.',
    priceUsd: 2.99,
    priceInCents: 299,
    glowColor: 'rgba(239,68,68,0.35)',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.35)',
  },
  {
    id: 'tide',
    name: 'Tide Crystal',
    emoji: '💧',
    element: 'Water',
    description: 'Unlocks evolution for Water-element ninja monsters. Channel the tidal surge.',
    priceUsd: 2.99,
    priceInCents: 299,
    glowColor: 'rgba(59,130,246,0.35)',
    bgColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.35)',
  },
  {
    id: 'gale',
    name: 'Gale Crystal',
    emoji: '💨',
    element: 'Wind',
    description: 'Unlocks evolution for Wind-element ninja monsters. Ride the storm winds.',
    priceUsd: 2.99,
    priceInCents: 299,
    glowColor: 'rgba(6,182,212,0.35)',
    bgColor: 'rgba(6,182,212,0.08)',
    borderColor: 'rgba(6,182,212,0.35)',
  },
  {
    id: 'thunder',
    name: 'Thunder Crystal',
    emoji: '⚡',
    element: 'Lightning',
    description: 'Unlocks evolution for Lightning-element ninja monsters. Strike with thunder.',
    priceUsd: 2.99,
    priceInCents: 299,
    glowColor: 'rgba(234,179,8,0.35)',
    bgColor: 'rgba(234,179,8,0.08)',
    borderColor: 'rgba(234,179,8,0.35)',
  },
  {
    id: 'terra',
    name: 'Terra Crystal',
    emoji: '🪨',
    element: 'Earth',
    description: 'Unlocks evolution for Earth-element ninja monsters. Awaken the stone titans.',
    priceUsd: 2.99,
    priceInCents: 299,
    glowColor: 'rgba(120,113,108,0.45)',
    bgColor: 'rgba(120,113,108,0.1)',
    borderColor: 'rgba(120,113,108,0.45)',
  },
  {
    id: 'void',
    name: 'Void Crystal',
    emoji: '🌑',
    element: 'Shadow',
    description: 'Unlocks evolution for Shadow-element ninja monsters. Embrace the void.',
    priceUsd: 3.99,
    priceInCents: 399,
    glowColor: 'rgba(168,85,247,0.35)',
    bgColor: 'rgba(168,85,247,0.08)',
    borderColor: 'rgba(168,85,247,0.35)',
  },
];

export default function CrystalShop() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createCheckoutSession = useCreateCheckoutSession();
  const { data: stripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-4">
        <p className="text-muted-foreground text-center">Please log in to access the Crystal Shop</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleBuy = async (crystal: Crystal) => {
    if (buyingId) return;
    setErrorMsg(null);
    setBuyingId(crystal.id);

    const item: ShoppingItem = {
      productName: crystal.name,
      currency: 'usd',
      quantity: BigInt(1),
      priceInCents: BigInt(crystal.priceInCents),
      productDescription: crystal.description,
    };

    try {
      const session = await createCheckoutSession.mutateAsync([item]);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setErrorMsg(message);
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background px-3 py-4 md:px-6 md:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1
            className="text-3xl md:text-4xl font-black text-primary tracking-wider mb-2"
            style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.08em' }}
          >
            💎 ELEMENTAL CRYSTAL SHOP
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Purchase Elemental Crystals to evolve your ninja monsters into their ultimate forms
          </p>
        </div>

        {/* Stripe Setup (admin only, shown when not configured) */}
        {!stripeLoading && <StripePaymentSetup />}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Stripe not configured warning for regular users */}
        {!stripeLoading && stripeConfigured === false && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>The shop is not yet configured. Please check back soon!</span>
          </div>
        )}

        {/* Crystal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CRYSTALS.map((crystal) => {
            const isBuying = buyingId === crystal.id;
            return (
              <div
                key={crystal.id}
                className="relative flex flex-col rounded-2xl border overflow-hidden transition-all hover:scale-[1.02]"
                style={{
                  background: crystal.bgColor,
                  borderColor: crystal.borderColor,
                  boxShadow: `0 0 18px ${crystal.glowColor}`,
                }}
              >
                {/* Glow top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: crystal.borderColor }}
                  aria-hidden="true"
                />

                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* Crystal icon + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{
                        background: crystal.bgColor,
                        border: `1.5px solid ${crystal.borderColor}`,
                        boxShadow: `0 0 10px ${crystal.glowColor}`,
                      }}
                    >
                      {crystal.emoji}
                    </div>
                    <div>
                      <p
                        className="font-black text-base text-foreground leading-tight"
                        style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.05em' }}
                      >
                        {crystal.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {crystal.element} Element
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                    {crystal.description}
                  </p>

                  {/* Price + Buy */}
                  <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-white/5">
                    <span
                      className="text-xl font-black text-foreground"
                      style={{ fontFamily: "'Bangers', cursive", letterSpacing: '0.05em' }}
                    >
                      ${crystal.priceUsd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleBuy(crystal)}
                      disabled={!!buyingId || stripeConfigured === false}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isBuying ? crystal.bgColor : crystal.borderColor,
                        color: '#fff',
                        border: `1.5px solid ${crystal.borderColor}`,
                        boxShadow: isBuying ? 'none' : `0 0 8px ${crystal.glowColor}`,
                      }}
                    >
                      {isBuying ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} />
                          Buy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info footer */}
        <div className="mt-8 p-4 bg-card border border-border rounded-2xl text-center">
          <p className="text-xs text-muted-foreground">
            💡 Crystals are added to your inventory after successful payment. Use them on the{' '}
            <button
              onClick={() => navigate({ to: '/roster' })}
              className="text-primary hover:underline font-medium"
            >
              Roster page
            </button>{' '}
            to evolve your ninja monsters.
          </p>
        </div>
      </div>
    </div>
  );
}
