import React from 'react';


// Simple Number to Words converter (Indian System placeholder)
// Ideally this should be in a utility file
function numberToWords(num) {
    // Use a library or a robust function in production
    // For now, return a placeholder or simple logic
    // Trying to implement a basic one here for speed
    return "Rupees " + num + " Only"; // Placeholder, will fix if requested or use library
}

export function InvoiceSummary({ items, taxMode }) {
    const subtotal = items.reduce((sum, item) => {
        const basic = item.qty * item.price;
        const disc = basic * (item.discount / 100);
        return sum + (basic - disc);
    }, 0);

    const taxRate = taxMode === 'IGST' ? 18 : 18; // Both total 18%
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="text-sm text-slate-500 max-w-xs">
                {/* Helper text or notes can go here */}
            </div>

            <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Sub New Total</span>
                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {taxMode === 'IGST' ? (
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>IGST (18%)</span>
                        <span>₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>CGST (9%)</span>
                            <span>₹{(taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>SGST (9%)</span>
                            <span>₹{(taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Grand Total</span>
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
