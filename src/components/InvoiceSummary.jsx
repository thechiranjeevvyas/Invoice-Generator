import React from 'react';
import { numberToWords } from '../lib/utils';

export function InvoiceSummary({ items, taxMode }) {
    const subtotal = items.reduce((sum, item) => {
        const basic = item.qty * item.price;
        const disc = basic * (item.discount / 100);
        return sum + (basic - disc);
    }, 0);

    let sgst = 0;
    let cgst = 0;
    let igst = 0;
    let totalGst = 0;

    if (taxMode === 'SGST_CGST') {
        sgst = subtotal * 0.09;
        cgst = subtotal * 0.09;
        totalGst = sgst + cgst;
    } else if (taxMode === 'IGST') {
        igst = subtotal * 0.18;
        totalGst = igst;
    }

    const grandTotal = Math.round(subtotal + totalGst);

    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="text-sm font-bold text-slate-900 uppercase max-w-sm">
                <span>TOTAL AMOUNT WORDS - [ {numberToWords(grandTotal)} ]</span>
            </div>

            <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-sm text-slate-900 font-bold uppercase">
                    <span>SUB TOTAL - RS</span>
                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-900 font-bold uppercase">
                    <span>SGST - 9%</span>
                    <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-900 font-bold uppercase">
                    <span>CGST - 9%</span>
                    <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-900 font-bold uppercase">
                    <span>IGST - 18%</span>
                    <span>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-900 font-bold uppercase pt-2 border-t border-slate-100">
                    <span>TOTAL GST - 18%</span>
                    <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900 uppercase">TOTAL NET AMOUNT INCL GST - RS</span>
                    <span className="font-bold text-xl text-slate-900">
                        ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Optional: Amount in Words */}
                {/* <div className="text-xs text-right text-slate-400">
            {numberToWords(Math.round(grandTotal))}
        </div> */}
            </div>
        </div>
    );
}
