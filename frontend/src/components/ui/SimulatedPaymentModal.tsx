import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, CreditCard, Building2, Smartphone, ArrowRight, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: {
    transactionRef: string;
    method: string;
    amount: number;
    paidAt: string;
  }) => void;
  title: string;
  stage: string;
  amount: number;
  invoiceNumber?: string;
  vendorName?: string;
}

export const SimulatedPaymentModal: React.FC<SimulatedPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  title,
  stage,
  amount,
  invoiceNumber = "INV-TRK-2026-089",
  vendorName = "The Royal Knot Concierge / Rambagh Palace",
}) => {
  const [method, setMethod] = useState<'neft' | 'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedRef = `TXN-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      setTxnRef(generatedRef);
      setIsProcessing(false);
      setIsCompleted(true);

      // Trigger celebratory gold confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#800020', '#C5A059', '#FAF7F2']
        });
      } catch (err) {
        // silent fallback if canvas-confetti is not loaded
      }

      onPaymentSuccess({
        transactionRef: generatedRef,
        method: method === 'upi' ? 'Simulated UPI' : method === 'neft' ? 'Simulated NEFT/RTGS' : 'Simulated Corporate Card',
        amount,
        paidAt: timestamp,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gold-300 shadow-royal-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-ivory-100 to-cream-100 border-b border-gold-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-800">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-800">Payment Authorization</h3>
              <p className="text-[11px] text-charcoal-500">Invoice Reference: {invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-gold-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Transparency Disclosure Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200/70 px-6 py-2.5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-snug">
            <strong>Demonstration Simulation:</strong> No live banking credentials or real funds are transacted. This simulates real-time escrow staging and accounting ledger updates for The Royal Knot platform.
          </p>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Simulated Payment Cleared
            </span>
            <h4 className="font-serif text-2xl font-bold text-charcoal-800 mt-2 mb-1">
              ₹{amount.toLocaleString('en-IN')} Received
            </h4>
            <p className="text-xs text-charcoal-500 mb-4">
              Beneficiary: <span className="font-medium text-charcoal-700">{vendorName}</span>
            </p>

            <div className="bg-ivory-100 rounded-xl p-4 text-left border border-gold-200 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Transaction ID:</span>
                <span className="font-mono font-medium text-charcoal-800">{txnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Stage:</span>
                <span className="font-medium text-burgundy-800 uppercase">{stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Status:</span>
                <span className="font-semibold text-emerald-700">Settled to Platform Escrow</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Return to Financial Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Amount & Item Summary */}
            <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-charcoal-500">Scheduled Milestone</p>
                <h4 className="font-serif text-lg font-bold text-charcoal-800">{title}</h4>
                <p className="text-xs text-burgundy-700 font-medium">Stage: {stage.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-charcoal-500">Amount Due</p>
                <p className="font-serif text-2xl font-bold text-burgundy-900">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Simulated Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-3">
                Select Payment Mode (Simulated)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    method === 'upi'
                      ? 'border-gold-500 bg-gold-50/80 text-gold-900 font-bold shadow-sm'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-gold-600" />
                  <span className="text-xs">UPI Auto-Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('neft')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    method === 'neft'
                      ? 'border-gold-500 bg-gold-50/80 text-gold-900 font-bold shadow-sm'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-gold-600" />
                  <span className="text-xs">RTGS / NEFT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    method === 'card'
                      ? 'border-gold-500 bg-gold-50/80 text-gold-900 font-bold shadow-sm'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gold-600" />
                  <span className="text-xs">Corporate Card</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Communicating with Mock Banking Gateway...</span>
              ) : (
                <>
                  <span>Simulate Escrow Settlement (₹{amount.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
