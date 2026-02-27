import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Settings, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function StripePaymentSetup() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: stripeConfigured, isLoading } = useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminChecked, setAdminChecked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US, CA, GB');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check admin status once actor is available
  React.useEffect(() => {
    if (actor && identity && !adminChecked) {
      setAdminChecked(true);
      actor.isCallerAdmin().then((result) => {
        setIsAdmin(result);
      }).catch(() => {
        setIsAdmin(false);
      });
    }
  }, [actor, identity, adminChecked]);

  // Don't render if: loading, already configured, not authenticated, or not admin
  if (isLoading || stripeConfigured || !identity || isAdmin === false || isAdmin === null) {
    return null;
  }

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!secretKey.trim()) {
      setErrorMsg('Please enter your Stripe secret key.');
      return;
    }
    const allowedCountries = countries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    if (allowedCountries.length === 0) {
      setErrorMsg('Please enter at least one allowed country.');
      return;
    }
    try {
      await setStripeConfig.mutateAsync({ secretKey: secretKey.trim(), allowedCountries });
      setSuccessMsg('Stripe configured successfully!');
      setExpanded(false);
      setSecretKey('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save configuration.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-yellow-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-yellow-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-400">Admin: Configure Stripe Payments</p>
            <p className="text-xs text-muted-foreground">Set up Stripe to enable crystal purchases</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-yellow-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-yellow-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-yellow-500/20">
          <div className="pt-3">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
              Stripe Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_..."
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
              Allowed Countries (comma-separated)
            </label>
            <input
              type="text"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="US, CA, GB"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-xs text-green-400">{successMsg}</p>
          )}

          <button
            onClick={handleSave}
            disabled={setStripeConfig.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-xl text-sm font-bold hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
          >
            {setStripeConfig.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
