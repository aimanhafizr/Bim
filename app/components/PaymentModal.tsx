"use client";

import React, { useState, useMemo } from "react";
import { Hall } from "../types";
import { X, CreditCard, ShieldCheck, Mail, User, Info, AlertTriangle } from "lucide-react";

interface PaymentModalProps {
  hall: Hall;
  date: string;
  selectedSlots: string[];
  onClose: () => void;
  onPaymentSuccess: (buyerName: string, buyerEmail: string) => void;
}

export default function PaymentModal({
  hall,
  date,
  selectedSlots,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Payment UI flow state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cost calculation
  const subtotal = selectedSlots.length * hall.pricePerHour;
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% Service Tax
  const serviceFee = 15; // Flat fee
  const totalAmount = subtotal + tax + serviceFee;

  // Detect card brand
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    return "unknown";
  }, [cardNumber]);

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    
    // Group by 4 digits
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);

    if (val.length > 2) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.substring(0, 3);
    setCvv(val);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) errors.name = "Cardholder name is required";
    if (!emailRegex.test(email)) errors.email = "Please enter a valid email address";
    
    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (cleanCard.length < 16) errors.cardNumber = "Card number must be 16 digits";
    
    const [month, year] = expiry.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (!expiry || expiry.length < 5) {
      errors.expiry = "Expiry date is incomplete";
    } else {
      const mNum = parseInt(month, 10);
      const yNum = parseInt(year, 10);
      if (mNum < 1 || mNum > 12) errors.expiry = "Invalid month";
      else if (yNum < currentYear || (yNum === currentYear && mNum < currentMonth)) {
        errors.expiry = "Card has expired";
      }
    }

    if (cvv.length < 3) errors.cvv = "CVV must be 3 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit payment form
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessingStep("Connecting to secure gateway...");

    // Simulate 3DSecure bank redirect flow after 1.5 seconds
    setTimeout(() => {
      setProcessingStep("Validating credentials...");
      setTimeout(() => {
        setProcessingStep("Contacting issuing bank for 3D Secure verification...");
        setTimeout(() => {
          setShowOtpScreen(true);
        }, 1200);
      }, 1000);
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) return;

    setShowOtpScreen(false);
    setProcessingStep("Verifying transaction code...");
    
    setTimeout(() => {
      setProcessingStep("Authorizing payment charges...");
      setTimeout(() => {
        setProcessingStep("Settling transaction funds...");
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess(name, email);
        }, 1500);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 flex flex-col md:flex-row md:h-[650px] animate-scale-up">
        
        {/* Loading/Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white p-6 text-center backdrop-blur-md">
            {!showOtpScreen ? (
              <div className="flex flex-col items-center gap-6 max-w-sm">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-tight">Securing Payment</h4>
                  <p className="text-sm text-zinc-400 mt-2 animate-pulse">{processingStep}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-400 mt-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Stripe Dev Sandbox Enabled (Free Test Mode)</span>
                </div>
              </div>
            ) : (
              /* Simulated 3D Secure / OTP Challenge Screen */
              <div className="flex flex-col items-center max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-zinc-100 animate-scale-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-center">3D Secure Bank Verification</h3>
                <p className="text-xs text-zinc-400 text-center mt-2 leading-relaxed">
                  We have sent a simulated verification OTP to cardholder. Please enter the verification code below to authorize the transaction.
                </p>

                <form onSubmit={handleOtpSubmit} className="w-full mt-6 flex flex-col gap-4">
                  <div>
                    <label className="block text-left text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                      Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center text-2xl tracking-widest font-mono rounded-xl bg-black border border-zinc-800 py-3.5 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-emerald-400 mt-2 block text-center">
                      * Enter any code to approve. Click Submit.
                    </span>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProcessing(false);
                        setShowOtpScreen(false);
                      }}
                      className="flex-1 rounded-xl bg-zinc-800 text-xs font-bold py-3 hover:bg-zinc-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={otpCode.length < 4}
                      className="flex-1 rounded-xl bg-emerald-600 text-xs font-bold py-3 hover:bg-emerald-500 transition disabled:opacity-40"
                    >
                      Approve Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Left Side: Summary Panel (35%) */}
        <div className="w-full md:w-[40%] bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 p-8 flex flex-col justify-between dark:bg-zinc-900/50 dark:border-zinc-900">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Booking Details
              </span>
              <button
                type="button"
                onClick={onClose}
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-zinc-300 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
              {hall.name}
            </h3>
            <p className="text-xs text-zinc-500 font-medium mb-6">
              Date: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{date}</span>
            </p>

            {/* Selected slots display */}
            <div className="flex flex-col gap-2.5 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Reserved Hours</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSlots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-lg bg-zinc-200/60 dark:bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-auto">
            <div className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Rate ({selectedSlots.length} hrs x ${hall.pricePerHour}/hr)</span>
                <span className="font-semibold text-zinc-850 dark:text-zinc-200">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="font-semibold text-zinc-850 dark:text-zinc-200">${serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & VAT (8%)</span>
                <span className="font-semibold text-zinc-850 dark:text-zinc-200">${tax}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4 mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
                <span>Total Due</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Input Panel (60%) */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              Secure Checkout
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit} className="flex-1 flex flex-col gap-5 justify-center">
            {/* Stripe Test Note */}
            <div className="flex gap-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 p-4 text-xs leading-relaxed text-sky-800 dark:text-sky-400">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-sky-500" />
              <div>
                <span className="font-bold">Stripe Sandbox Mode Enabled:</span> This form is running in sandboxed test mode. Please use card numbers like <span className="font-bold font-mono bg-sky-100/60 dark:bg-sky-900/40 px-1 py-0.5 rounded text-sky-600">4242 4242 4242 4242</span> with any valid future expiry and 3-digit CVV for a successful test. No real charges are made.
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Receipt Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border px-10 py-3 text-sm focus:outline-none dark:bg-zinc-900 ${
                    formErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500 dark:border-zinc-800"
                  }`}
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
              {formErrors.email && (
                <span className="text-[11px] font-semibold text-red-500 mt-1 block">{formErrors.email}</span>
              )}
            </div>

            {/* Name on Card Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Cardholder Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border px-10 py-3 text-sm focus:outline-none dark:bg-zinc-900 ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500 dark:border-zinc-800"
                  }`}
                  required
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
              {formErrors.name && (
                <span className="text-[11px] font-semibold text-red-500 mt-1 block">{formErrors.name}</span>
              )}
            </div>

            {/* Card Number Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full rounded-xl border px-10 py-3 text-sm font-mono tracking-wider focus:outline-none dark:bg-zinc-900 ${
                    formErrors.cardNumber
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500 dark:border-zinc-800"
                  }`}
                  required
                />
                <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                
                {/* Brand Logo Indicator */}
                <div className="absolute right-3.5 top-2.5 text-[10px] font-bold uppercase rounded bg-zinc-100 text-zinc-500 border border-zinc-200 px-1.5 py-1 select-none dark:bg-zinc-800 dark:border-zinc-700">
                  {cardBrand === "visa"
                    ? "VISA"
                    : cardBrand === "mastercard"
                    ? "MC"
                    : cardBrand === "amex"
                    ? "AMEX"
                    : "CARD"}
                </div>
              </div>
              {formErrors.cardNumber && (
                <span className="text-[11px] font-semibold text-red-500 mt-1 block">{formErrors.cardNumber}</span>
              )}
            </div>

            {/* Expiry and CVV Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none dark:bg-zinc-900 ${
                    formErrors.expiry
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500 dark:border-zinc-800"
                  }`}
                  required
                />
                {formErrors.expiry && (
                  <span className="text-[11px] font-semibold text-red-500 mt-1 block">{formErrors.expiry}</span>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Secure Code (CVV)
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={handleCvvChange}
                  className={`w-full rounded-xl border px-4 py-3 text-sm tracking-widest focus:outline-none dark:bg-zinc-900 ${
                    formErrors.cvv
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500 dark:border-zinc-800"
                  }`}
                  required
                />
                {formErrors.cvv && (
                  <span className="text-[11px] font-semibold text-red-500 mt-1 block">{formErrors.cvv}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 transition-all duration-300 shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-5 w-5" />
              Authorize Charge of ${totalAmount.toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
