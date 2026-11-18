"use client";

import React, { useRef } from "react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface InvoiceData {
  invoice_number: string;
  user_email: string;
  tier: string;
  amount_paise: number;
  base_amount_paise?: number;
  gst_amount_paise?: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_at?: string;
  verified_at?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}

export default function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const totalPaise = invoice.amount_paise || 0;
  const gstPaise = invoice.gst_amount_paise ?? Math.round((totalPaise * 18) / 118);
  const basePaise = invoice.base_amount_paise ?? totalPaise - gstPaise;

  const cgstPaise = Math.round(gstPaise / 2);
  const sgstPaise = gstPaise - cgstPaise;

  const formatInr = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = invoice.verified_at
    ? new Date(invoice.verified_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border-4 border-dark shadow-[10px_10px_0px_#171717] max-w-xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8"
        >
          {/* Top Actions (hidden during print) */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-dark/10 print:hidden">
            <div className="flex items-center gap-2">
              <span className="sticker bg-lime text-dark text-xs">TAX INVOICE</span>
              <span className="font-mono text-xs font-bold text-dark/70">
                {invoice.invoice_number}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream hover:bg-dark hover:text-white text-dark font-display font-bold text-xs uppercase border-2 border-dark transition-all cursor-pointer shadow-[2px_2px_0px_#171717]"
              >
                <Printer size={13} />
                <span>PRINT / PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-red-100 border-2 border-dark text-dark transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div ref={printRef} className="space-y-6 pt-4 text-dark font-sans">
            {/* Header / Brand */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark flex items-center gap-2">
                  <span>COMPANION</span>
                  <span className="text-coral text-sm">®</span>
                </h2>
                <p className="font-mono text-[11px] text-dark/70 mt-1">
                  Companion Social Network Pvt Ltd<br />
                  Park Street, Kolkata, WB 700016<br />
                  GSTIN: 19AAACC1206P1Z3 | SAC: 998431
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-lavender border-2 border-dark font-mono font-bold text-xs">
                  ORIGINAL FOR RECIPIENT
                </span>
                <p className="font-mono text-xs text-dark/70 mt-2">
                  Invoice: <strong>{invoice.invoice_number}</strong><br />
                  Date: <strong>{invoiceDate}</strong>
                </p>
              </div>
            </div>

            {/* Billed To */}
            <div className="p-3.5 rounded-2xl bg-cream border-2 border-dark/30 text-xs font-mono space-y-1">
              <span className="text-[10px] font-bold text-dark/60 uppercase">BILLED TO (SUBSCRIBER):</span>
              <p className="font-bold text-dark">{invoice.user_email}</p>
              <p className="text-dark/70">Place of Supply: West Bengal (19) • India</p>
              {invoice.razorpay_payment_id && (
                <p className="text-[10px] text-dark/60 pt-1">
                  Razorpay Payment ID: <strong>{invoice.razorpay_payment_id}</strong>
                </p>
              )}
            </div>

            {/* Line items table */}
            <div className="border-2 border-dark rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-dark text-white font-display text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-2 text-center">SAC</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/20">
                  <tr className="bg-white">
                    <td className="py-3 px-3">
                      <p className="font-bold uppercase text-dark">
                        {invoice.tier} Membership Subscription (30 Days)
                      </p>
                      <p className="text-[10px] text-dark/60">
                        Full access to all {invoice.tier.toUpperCase()} community features & bookings
                      </p>
                    </td>
                    <td className="py-3 px-2 text-center text-dark/70">998431</td>
                    <td className="py-3 px-3 text-right font-bold text-dark">
                      {formatInr(basePaise)}
                    </td>
                  </tr>
                  <tr className="bg-cream/40">
                    <td className="py-2 px-3 text-dark/70">CGST (9%)</td>
                    <td className="py-2 px-2 text-center text-dark/50">-</td>
                    <td className="py-2 px-3 text-right text-dark/80">{formatInr(cgstPaise)}</td>
                  </tr>
                  <tr className="bg-cream/40">
                    <td className="py-2 px-3 text-dark/70">SGST (9%)</td>
                    <td className="py-2 px-2 text-center text-dark/50">-</td>
                    <td className="py-2 px-3 text-right text-dark/80">{formatInr(sgstPaise)}</td>
                  </tr>
                  <tr className="bg-dark text-white font-display text-sm font-black">
                    <td className="py-3 px-3 uppercase" colSpan={2}>
                      Total Amount Paid (INR)
                    </td>
                    <td className="py-3 px-3 text-right text-lime">
                      {formatInr(totalPaise)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer / Notes */}
            <div className="pt-2 text-[11px] font-mono text-dark/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-green-700 font-bold">
                <CheckCircle2 size={14} />
                <span>PAID VIA RAZORPAY • ZERO OUTSTANDING</span>
              </div>
              <span className="text-[10px] text-dark/50">This is a system generated tax invoice.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

