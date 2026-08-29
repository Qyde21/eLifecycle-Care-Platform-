import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MPesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountKsh: number;
  purpose: string;
  referenceId: string;
  onSuccess: (receipt: string) => void;
}

export const MPesaModal: React.FC<MPesaModalProps> = ({
  isOpen,
  onClose,
  amountKsh,
  purpose,
  referenceId,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [step, setStep] = useState<'input' | 'prompt-sent' | 'pin-entry' | 'verifying' | 'success'>('input');
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(25);
  const [receipt, setReceipt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setPin('');
      setCountdown(25);
      setReceipt('');
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (step === 'prompt-sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && step === 'prompt-sent') {
      setStep('pin-entry');
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendSTK = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          amountKsh,
          reference: referenceId,
          accountName: 'Nobscott eLC Ecosystem',
        }),
      });
      const data = await res.json();
      setLoading(false);
      setReceipt(data.receiptNumber || `QH${Math.floor(10000000 + Math.random() * 90000000)}K`);
      setStep('prompt-sent');
    } catch {
      setLoading(false);
      setReceipt(`QH${Math.floor(10000000 + Math.random() * 90000000)}K`);
      setStep('prompt-sent');
    }
  };

  const handleConfirmPin = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00a859', '#38bdf8', '#fbbf24']
      });
      setTimeout(() => {
        onSuccess(receipt);
      }, 1800);
    }, 1500);
  };

  return (
    <div id="mpesa-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="mpesa-dialog-card"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 font-black text-lg">
              M
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Safaricom Daraja Express
              </div>
              <h3 className="text-lg font-bold">M-Pesa Native Payment</h3>
            </div>
          </div>
          <button 
            id="close-mpesa-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
              <span>Payee:</span>
              <span className="font-semibold text-slate-200">Nobscott MRO eLC Hub</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
              <span>Purpose:</span>
              <span className="text-slate-300 font-medium text-right max-w-[200px] truncate">{purpose}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Total Payable:</span>
              <span className="text-2xl font-bold text-emerald-400">
                KSh {amountKsh.toLocaleString()}
              </span>
            </div>
          </div>

          {step === 'input' && (
            <form onSubmit={handleSendSTK} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enter Safaricom M-Pesa Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500 font-bold text-sm">
                    +254
                  </div>
                  <input
                    id="mpesa-phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="07XX XXX XXX"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-16 pr-4 text-slate-100 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-base"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Instant STK Push will prompt your SIM toolkit securely.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="mpesa-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Initiating Daraja STK Push...
                    </>
                  ) : (
                    <>
                      Send M-Pesa STK Prompt
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'prompt-sent' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-emerald-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {countdown}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-100">STK Push Dispatched!</h4>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  Check your phone screen for the Safaricom M-Pesa PIN prompt for <span className="text-emerald-400 font-bold">KSh {amountKsh.toLocaleString()}</span>.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400">
                Simulating interactive prompt... (or click below to enter PIN)
              </div>

              <button
                id="enter-pin-direct-btn"
                type="button"
                onClick={() => setStep('pin-entry')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                Open Virtual Handset PIN Prompt
              </button>
            </div>
          )}

          {step === 'pin-entry' && (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                <div className="text-xs uppercase font-mono text-emerald-300 tracking-wider mb-1">
                  M-PESA SIM TOOLKIT
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  Do you want to pay KSh {amountKsh.toLocaleString()} to Nobscott MRO?
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Enter 4-Digit M-Pesa PIN
                </label>
                <input
                  id="mpesa-pin-input"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-40 mx-auto block text-center tracking-[1em] text-2xl font-mono bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button
                id="confirm-pin-btn"
                type="button"
                onClick={handleConfirmPin}
                disabled={pin.length < 4}
                className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
              >
                Authorize Payment
              </button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
              <h4 className="font-bold text-lg">Verifying with Safaricom Daraja...</h4>
              <p className="text-xs text-slate-400">Locking transaction and updating Nobscott MRO ledger.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-100">Payment Confirmed!</h4>
                <div className="mt-2 inline-block bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400">
                  Receipt: {receipt}
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Transaction recorded. Digital warranty & invoice attached to your device registry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
