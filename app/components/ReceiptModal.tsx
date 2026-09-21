"use client";

import { useRef } from "react";
import { Hall, Booking } from "../types";
import { Check, Printer, Calendar, CalendarPlus, X, Mail } from "lucide-react";

interface ReceiptModalProps {
  hall: Hall;
  booking: Booking;
  onClose: () => void;
}

export default function ReceiptModal({ hall, booking, onClose }: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    
    // Simple custom print window trigger
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt - ${booking.id}</title>
            <style>
              body { font-family: system-ui, sans-serif; color: #111; padding: 40px; }
              .receipt-container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; border-radius: 12px; }
              .header { text-align: center; border-bottom: 2px solid #f4f4f5; padding-bottom: 20px; margin-bottom: 20px; }
              .ref { font-family: monospace; font-size: 16px; font-weight: bold; color: #10b981; }
              .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
              .label { color: #666; }
              .value { font-weight: bold; }
              .total-box { background: #f4f4f5; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 20px; display: flex; justify-content: space-between; }
              .qr-mock { text-align: center; margin-top: 30px; padding: 10px; border: 1px dashed #ccc; border-radius: 8px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="header">
                <h2>BOOKING RESERVATION TICKET</h2>
                <div class="ref">${booking.id}</div>
              </div>
              <div class="row"><span class="label">Hall Selected:</span><span class="value">${hall.name}</span></div>
              <div class="row"><span class="label">Event Date:</span><span class="value">${booking.date}</span></div>
              <div class="row"><span class="label">Time Slots:</span><span class="value">${booking.timeSlots.join(", ")}</span></div>
              <div class="row"><span class="label">Hours Reserved:</span><span class="value">${booking.timeSlots.length} hour(s)</span></div>
              <hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 20px 0;" />
              <div class="row"><span class="label">Cardholder Name:</span><span class="value">${booking.name}</span></div>
              <div class="row"><span class="label">Registered Email:</span><span class="value">${booking.email}</span></div>
              <div class="row"><span class="label">Payment Status:</span><span class="value" style="color: #10b981;">PAID (Stripe Test)</span></div>
              <div class="total-box"><span>Amount Paid:</span><span>$${booking.totalPaid.toFixed(2)}</span></div>
              <div style="text-align: center; margin-top: 30px;">
                <div class="qr-mock">
                  <div style="font-size: 10px; color: #777;">BOOKING SECURE ENTRY TICKET QR</div>
                  <div style="font-size: 16px; font-weight: bold; margin-top: 5px; font-family: monospace;">*ENTRY-SECURE-${booking.id}*</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Mock calendar event addition
  const handleAddToCalendar = () => {
    alert(`Calendar invitation created! An ICS event file was sent to ${booking.email}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      {/* Receipt Ticket Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-8 dark:bg-zinc-950 dark:border-zinc-800 animate-scale-up">
        {/* Success Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-900/30">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            Your transaction was authorized successfully. Here is your entry ticket.
          </p>
        </div>

        {/* Ticket Box */}
        <div
          ref={printRef}
          className="border-2 border-dashed border-zinc-200 rounded-3xl p-6 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20 mb-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-5 pb-5 border-b border-zinc-200/50 dark:border-zinc-800/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Reservation Reference
              </span>
              <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {booking.id}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Transaction Date
              </span>
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Booking Info List */}
          <div className="flex flex-col gap-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Hall Space</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{booking.hallName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Scheduled Date</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{booking.date}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 shrink-0">Time Slots</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 text-right max-w-[200px] break-words">
                {booking.timeSlots.join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Duration</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {booking.timeSlots.length} hour(s)
              </span>
            </div>

            <hr className="border-t border-zinc-200/60 dark:border-zinc-800 my-1" />

            <div className="flex justify-between">
              <span className="text-zinc-500">Cardholder</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{booking.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Contact Email</span>
              <span className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {booking.email}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-200/60 dark:border-zinc-800 pt-3.5 mt-1">
              <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">Total Paid</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ${booking.totalPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Secure QR / Barcode Code Mock */}
          <div className="mt-6 flex flex-col items-center gap-2 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="flex h-16 w-48 items-center justify-center border border-zinc-200 rounded-lg bg-white select-none dark:border-zinc-800 dark:bg-zinc-950 font-mono tracking-widest font-bold text-xs text-zinc-400">
              ||| |||| | |||| | |||| ||
            </div>
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
              Secure QR Code Entry Ticket
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold py-3 px-4 transition flex items-center justify-center gap-2 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
            <button
              onClick={handleAddToCalendar}
              type="button"
              className="flex-1 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold py-3 px-4 transition flex items-center justify-center gap-2 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <CalendarPlus className="h-4 w-4" />
              Add to Calendar
            </button>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-full rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold py-3.5 text-sm transition dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
