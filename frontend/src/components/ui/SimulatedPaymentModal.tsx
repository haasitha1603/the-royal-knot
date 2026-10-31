import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  CreditCard,
  Building2,
  Smartphone,
  ArrowRight,
  Receipt,
  QrCode,
  Banknote,
  Clock,
  Lock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: {
    transactionRef: string;
    method: string;
    amount: number;
    paidAt: string;
    status: 'completed' | 'pending_verification';
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
  // Selectable Payment Methods: 'card' | 'upi' | 'cash'
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'cash'>('upi');

  // Sub-tabs for UPI
  const [upiMode, setUpiMode] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('aarav.singhania@okhdfcbank');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9812');
  const [cardHolder, setCardHolder] = useState('Aarav Singhania');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // Processing & completion state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultDetails, setResultDetails] = useState<{
    txnRef: string;
    status: 'completed' | 'pending_verification';
    methodLabel: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      if (selectedMethod === 'cash') {
        // Physical Cash workflow: marked as "Pending Verification"
        const voucherRef = `CASH-VCHR-${Math.floor(100000 + Math.random() * 900000)}`;
        setResultDetails({
          txnRef: voucherRef,
          status: 'pending_verification',
          methodLabel: 'Physical Cash (Pending Verification)'
        });
        setIsProcessing(false);
        setIsCompleted(true);

        onPaymentSuccess({
          transactionRef: voucherRef,
          method: 'Physical Cash',
          amount,
          paidAt: timestamp,
          status: 'pending_verification'
        });
      } else {
        // Electronic (Card or UPI): Immediate verified completion
        const generatedRef = `TXN-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
        setResultDetails({
          txnRef: generatedRef,
          status: 'completed',
          methodLabel: selectedMethod === 'upi' ? `UPI (${upiMode === 'qr' ? 'QR Code Scan' : upiId})` : 'Card (Gateway Settlement)'
        });
        setIsProcessing(false);
        setIsCompleted(true);

        // Confetti for digital settlement
        try {
          confetti({
            particleCount: 45,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#800020', '#C5A059', '#FAF7F2']
          });
        } catch (err) {
          // silent fallback
        }

        onPaymentSuccess({
          transactionRef: generatedRef,
          method: selectedMethod === 'upi' ? 'UPI Instant Transfer' : 'Credit/Debit Card',
          amount,
          paidAt: timestamp,
          status: 'completed'
        });
      }
    }, 1400);
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

        {/* Transparency Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200/70 px-6 py-2.5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-snug">
            <strong>Demonstration Simulation:</strong> Real-time escrow accounting workflow. Select from Card, UPI, or Cash methods.
          </p>
        </div>

        {isCompleted && resultDetails ? (
          <div className="p-8 text-center">
            {resultDetails.status === 'completed' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Cleared & Escrow Bound
                </span>
                <h4 className="font-serif text-2xl font-bold text-charcoal-800 mt-2 mb-1">
                  ₹{amount.toLocaleString('en-IN')} Received
                </h4>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
                  <Clock className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Cash Voucher: Pending Verification
                </span>
                <h4 className="font-serif text-2xl font-bold text-charcoal-800 mt-2 mb-1">
                  ₹{amount.toLocaleString('en-IN')} Awaiting On-Site Count
                </h4>
              </>
            )}

            <p className="text-xs text-charcoal-500 mb-4">
              Beneficiary: <span className="font-medium text-charcoal-700">{vendorName}</span>
            </p>

            <div className="bg-ivory-100 rounded-xl p-4 text-left border border-gold-200 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-charcoal-500">
                  {resultDetails.status === 'completed' ? 'Transaction ID:' : 'Cash Voucher Code:'}
                </span>
                <span className="font-mono font-medium text-charcoal-800">{resultDetails.txnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Method:</span>
                <span className="font-medium text-charcoal-800">{resultDetails.methodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Status:</span>
                {resultDetails.status === 'completed' ? (
                  <span className="font-semibold text-emerald-700">Settled to Platform Escrow</span>
                ) : (
                  <span className="font-semibold text-amber-700">Pending Verification (On-Site Finance)</span>
                )}
              </div>
            </div>

            {resultDetails.status === 'pending_verification' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 leading-relaxed mb-6">
                <strong>Protocol Note:</strong> Please present voucher code <code>{resultDetails.txnRef}</code> to the authorized on-site finance executive at Rambagh Palace foyer. Once physical cash is counted and a signed receipt is issued, this invoice will automatically transition to "Completed".
              </div>
            )}

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

            {/* Three Distinct Selectable Payment Methods */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Method 1: Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'card'
                      ? 'border-gold-500 bg-gold-50/90 text-gold-950 font-bold shadow-sm ring-2 ring-gold-300'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gold-700" />
                  <span className="text-xs">Credit / Debit Card</span>
                </button>

                {/* Method 2: UPI */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'upi'
                      ? 'border-gold-500 bg-gold-50/90 text-gold-950 font-bold shadow-sm ring-2 ring-gold-300'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-gold-700" />
                  <span className="text-xs">UPI (QR / ID)</span>
                </button>

                {/* Method 3: Cash */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cash')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'cash'
                      ? 'border-amber-500 bg-amber-50/90 text-amber-950 font-bold shadow-sm ring-2 ring-amber-300'
                      : 'border-gold-200 bg-white text-charcoal-600 hover:border-gold-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-700" />
                  <span className="text-xs">Physical Cash</span>
                </button>
              </div>
            </div>

            {/* DYNAMIC FORM ACCORDING TO SELECTED METHOD */}

            {/* 1. CARD METHOD VIEW */}
            {selectedMethod === 'card' && (
              <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200 mb-6 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-charcoal-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. UPI METHOD VIEW */}
            {selectedMethod === 'upi' && (
              <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200 mb-6 space-y-4 text-xs">
                {/* UPI Sub-tabs */}
                <div className="flex border-b border-gold-200 pb-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUpiMode('qr')}
                    className={`text-xs font-semibold pb-1 transition-colors ${
                      upiMode === 'qr'
                        ? 'text-burgundy-800 border-b-2 border-gold-500 font-bold'
                        : 'text-charcoal-500 hover:text-charcoal-800'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode('id')}
                    className={`text-xs font-semibold pb-1 transition-colors ${
                      upiMode === 'id'
                        ? 'text-burgundy-800 border-b-2 border-gold-500 font-bold'
                        : 'text-charcoal-500 hover:text-charcoal-800'
                    }`}
                  >
                    Enter UPI ID / VPA
                  </button>
                </div>

                {upiMode === 'qr' ? (
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gold-200">
                    {/* Simulated Authentic Indian UPI QR Code */}
                    <div className="w-36 h-36 border-2 border-gold-400 p-2 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center">
                      <QrCode className="w-28 h-28 text-charcoal-800" />
                    </div>
                    <span className="text-[11px] font-bold text-charcoal-800 mt-2">
                      Scan to pay ₹{amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-charcoal-500">
                      Supports Google Pay • PhonePe • BHIM • Paytm
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                      UPI ID / Virtual Payment Address
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2 rounded-lg border border-gold-300 bg-white text-charcoal-800 font-medium"
                    />
                    <p className="text-[10px] text-charcoal-400 mt-1">
                      A simulated collect request will be dispatched to your UPI app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. CASH METHOD VIEW */}
            {selectedMethod === 'cash' && (
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 mb-6 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Banknote className="w-4 h-4 text-amber-700" />
                  <span>On-Site Cash Payment Protocol</span>
                </div>

                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Cash payments require verification by an authorized on-site finance representative. Upon submission, a Cash Voucher will be generated.
                </p>

                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1 text-[11px]">
                  <div className="flex justify-between text-charcoal-700">
                    <span>Initial Status:</span>
                    <span className="font-bold text-amber-800 uppercase tracking-wider">Pending Verification</span>
                  </div>
                  <div className="flex justify-between text-charcoal-700">
                    <span>Verification Location:</span>
                    <span>Rambagh Palace Accounts Foyer</span>
                  </div>
                  <div className="flex justify-between text-charcoal-700">
                    <span>Authorized Signatory:</span>
                    <span>Shri Digvijay Singh (Senior Treasurer)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 ${
                selectedMethod === 'cash'
                  ? 'bg-amber-800 hover:bg-amber-900'
                  : 'bg-burgundy-700 hover:bg-burgundy-800'
              }`}
            >
              {isProcessing ? (
                <span>Communicating with Secure Gateway...</span>
              ) : selectedMethod === 'cash' ? (
                <>
                  <span>Generate Cash Voucher (Pending Verification)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
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
